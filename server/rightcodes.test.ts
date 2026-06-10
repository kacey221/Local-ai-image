import assert from 'node:assert/strict';
import test from 'node:test';
import {
  bufferToDataUrl,
  buildRightCodesImageRequest,
  buildRightCodesUpscaleRequest,
  mapAspectRatioToRightCodesSize,
  normalizeRightCodesUpstreamError,
  postRightCodesGenerationRequest,
  shouldRetryRightCodesUpstreamError,
} from './rightcodes';

test('maps supported aspect ratios to Right Codes size strings', () => {
  assert.equal(mapAspectRatioToRightCodesSize('1:1'), '1024x1024');
  assert.equal(mapAspectRatioToRightCodesSize('3:4'), '1024x1536');
  assert.equal(mapAspectRatioToRightCodesSize('4:3'), '1536x1024');
  assert.equal(mapAspectRatioToRightCodesSize('9:16'), '1024x1536');
  assert.equal(mapAspectRatioToRightCodesSize('16:9'), '1536x1024');
  assert.equal(mapAspectRatioToRightCodesSize('auto' as any), 'auto');
});

test('builds a Right Codes request body with normalized reference image input', () => {
  const request = buildRightCodesImageRequest({
    prompt: 'a cinematic portrait',
    negativePrompt: 'blurry, low quality',
    aspectRatio: '3:4',
    referenceImage: 'data:image/png;base64,ZmFrZS1pbWFnZS1ieXRlcw==',
    referenceBindingNote: '参考图绑定：编号2对应@参考图2。',
  });

  assert.deepEqual(request, {
    model: 'gpt-image-2',
    prompt: '参考图绑定：编号2对应@参考图2。\n\na cinematic portrait. Avoid: blurry, low quality',
    image: ['ZmFrZS1pbWFnZS1ieXRlcw=='],
    size: '1024x1536',
    response_format: 'url',
  });
});

test('uses the explicitly selected Right Codes model when provided', () => {
  const request = buildRightCodesImageRequest({
    model: 'nano-banana-pro',
    prompt: 'banana mascot character',
    aspectRatio: '1:1',
  });

  assert.equal(request.model, 'nano-banana-pro');
});

test('builds a Right Codes upscale request that preserves the source image composition', () => {
  const request = buildRightCodesUpscaleRequest({
    model: 'nano-banana-pro',
    image: 'data:image/png;base64,c291cmNlLWltYWdl',
    originalPrompt: 'cute toy robot, studio light',
    aspectRatio: '4:3',
  });

  assert.equal(request.model, 'nano-banana-pro');
  assert.equal(request.size, '1536x1024');
  assert.deepEqual(request.image, ['c291cmNlLWltYWdl']);
  assert.match(request.prompt, /Preserve the exact composition/);
  assert.match(request.prompt, /cute toy robot, studio light/);
});

test('keeps remote reference image urls unchanged', () => {
  const request = buildRightCodesImageRequest({
    prompt: 'illustrated cat',
    aspectRatio: '16:9',
    referenceImage: 'https://example.com/reference.png',
  });

  assert.deepEqual(request.image, ['https://example.com/reference.png']);
  assert.equal(request.size, '1536x1024');
});

test('converts binary image bytes into a data url', () => {
  const result = bufferToDataUrl('image/jpeg', Buffer.from('hello world'));

  assert.equal(result, 'data:image/jpeg;base64,aGVsbG8gd29ybGQ=');
});

test('identifies transient Right Codes upstream errors that should be retried', () => {
  assert.equal(shouldRetryRightCodesUpstreamError(524, '<!DOCTYPE html><title>524</title>'), true);
  assert.equal(
    shouldRetryRightCodesUpstreamError(
      500,
      '{"error":{"message":"excessive system load","type":"upstream_error","param":"","code":null}}',
    ),
    true,
  );
  assert.equal(
    shouldRetryRightCodesUpstreamError(
      400,
      '{"error":{"message":"Parameter data type error, please check if the parameter data type is correct.","type":"upstream_error","param":"","code":null}}',
    ),
    false,
  );
});

test('normalizes noisy upstream error bodies into friendly messages', () => {
  assert.equal(
    normalizeRightCodesUpstreamError(
      524,
      '<!DOCTYPE html><html><head><title>xxsxx.fun | 524: A timeout occurred</title></head></html>',
    ),
    'Right Codes timed out while generating the image. Please try again.',
  );
  assert.equal(
    normalizeRightCodesUpstreamError(
      500,
      '{"error":{"message":"excessive system load","type":"upstream_error","param":"","code":null}}',
    ),
    'Right Codes is temporarily overloaded. Please try again.',
  );
});

test('retries transient fetch failures before succeeding', async () => {
  let attempts = 0;
  const retryDelays: number[] = [];

  const data = await postRightCodesGenerationRequest({
    apiKey: 'test-key',
    requestBody: buildRightCodesImageRequest({
      prompt: 'stormy ocean painting',
      aspectRatio: '1:1',
    }),
    fetchImpl: async () => {
      attempts += 1;

      if (attempts === 1) {
        const error = new TypeError('fetch failed');
        (error as TypeError & { cause?: { code: string } }).cause = { code: 'ECONNRESET' };
        throw error;
      }

      return {
        ok: true,
        status: 200,
        json: async () => ({ data: [{ url: 'https://example.com/generated.png' }] }),
        text: async () => '',
      };
    },
    sleep: async (ms) => {
      retryDelays.push(ms);
    },
  });

  assert.equal(attempts, 2);
  assert.deepEqual(retryDelays, [1200]);
  assert.equal(data.data[0].url, 'https://example.com/generated.png');
});

test('retries timeout responses and surfaces the final friendly error after exhaustion', async () => {
  let attempts = 0;
  const retryDelays: number[] = [];

  await assert.rejects(
    () =>
      postRightCodesGenerationRequest({
        apiKey: 'test-key',
        requestBody: buildRightCodesImageRequest({
          prompt: 'cinematic skyline',
          aspectRatio: '16:9',
        }),
        maxAttempts: 3,
        fetchImpl: async () => {
          attempts += 1;
          return {
            ok: false,
            status: 524,
            json: async () => ({ error: { message: 'timeout' } }),
            text: async () => '<html><title>524: A timeout occurred</title></html>',
          };
        },
        sleep: async (ms) => {
          retryDelays.push(ms);
        },
      }),
    /Right Codes timed out while generating the image\. Please try again\./,
  );

  assert.equal(attempts, 3);
  assert.deepEqual(retryDelays, [1200, 2400]);
});
