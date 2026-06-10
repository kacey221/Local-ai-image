export type SupportedAspectRatio = '1:1' | '3:4' | '4:3' | '9:16' | '16:9' | 'auto';

export interface RightCodesImageRequestInput {
  prompt: string;
  negativePrompt?: string;
  aspectRatio?: SupportedAspectRatio;
  referenceImage?: string;
  referenceBindingNote?: string;
  model?: string;
}

export interface RightCodesUpscaleRequestInput {
  image: string;
  originalPrompt?: string;
  negativePrompt?: string;
  aspectRatio?: SupportedAspectRatio;
  model?: string;
}

export interface RightCodesImageRequestBody {
  model: string;
  prompt: string;
  image?: string[];
  size: string;
  response_format: 'url';
}

interface RightCodesResponseLike {
  ok: boolean;
  status: number;
  json(): Promise<any>;
  text(): Promise<string>;
}

interface PostRightCodesGenerationRequestOptions {
  apiKey: string;
  requestBody: RightCodesImageRequestBody;
  fetchImpl?: (input: string, init?: RequestInit) => Promise<RightCodesResponseLike>;
  maxAttempts?: number;
  sleep?: (ms: number) => Promise<void>;
}

const RIGHTCODES_SIZE_MAP: Record<SupportedAspectRatio, string> = {
  '1:1': '1024x1024',
  '3:4': '1024x1536',
  '4:3': '1536x1024',
  '9:16': '1024x1536',
  '16:9': '1536x1024',
  'auto': 'auto',
};

export function mapAspectRatioToRightCodesSize(aspectRatio: SupportedAspectRatio = '1:1'): string {
  return RIGHTCODES_SIZE_MAP[aspectRatio];
}

export function normalizeRightCodesReferenceImage(referenceImage?: string): string | undefined {
  if (!referenceImage) {
    return undefined;
  }

  const base64Marker = 'base64,';
  const markerIndex = referenceImage.indexOf(base64Marker);
  if (markerIndex !== -1) {
    return referenceImage.slice(markerIndex + base64Marker.length);
  }

  return referenceImage;
}

export function buildRightCodesImageRequest(input: RightCodesImageRequestInput): RightCodesImageRequestBody {
  const promptWithReferenceBinding = input.referenceBindingNote?.trim()
    ? `${input.referenceBindingNote.trim()}\n\n${input.prompt}`
    : input.prompt;
  const combinedPrompt = input.negativePrompt?.trim()
    ? `${promptWithReferenceBinding}. Avoid: ${input.negativePrompt.trim()}`
    : promptWithReferenceBinding;

  const body: RightCodesImageRequestBody = {
    model: input.model || 'gpt-image-2',
    prompt: combinedPrompt,
    size: mapAspectRatioToRightCodesSize(input.aspectRatio || '1:1'),
    response_format: 'url',
  };

  const normalizedImage = normalizeRightCodesReferenceImage(input.referenceImage);
  if (normalizedImage) {
    body.image = [normalizedImage];
  }

  return body;
}

export function buildRightCodesUpscaleRequest(
  input: RightCodesUpscaleRequestInput,
): RightCodesImageRequestBody {
  const promptParts = [
    'Upscale this image into a cleaner, sharper high-definition version.',
    'Preserve the exact composition, subject placement, colors, silhouette, and overall design.',
    'Add fine detail, clean edges, and richer texture without changing the scene.',
  ];

  if (input.originalPrompt?.trim()) {
    promptParts.push(`Original prompt context: ${input.originalPrompt.trim()}.`);
  }

  return buildRightCodesImageRequest({
    model: input.model,
    prompt: promptParts.join(' '),
    negativePrompt: input.negativePrompt,
    aspectRatio: input.aspectRatio,
    referenceImage: input.image,
  });
}

export function bufferToDataUrl(contentType: string, bytes: Buffer): string {
  return `data:${contentType};base64,${bytes.toString('base64')}`;
}

export function shouldRetryRightCodesUpstreamError(status: number, details: string): boolean {
  const normalizedDetails = details.toLowerCase();
  return (
    status === 524 ||
    normalizedDetails.includes('excessive system load') ||
    normalizedDetails.includes('a timeout occurred') ||
    normalizedDetails.includes('error code 524')
  );
}

export function normalizeRightCodesUpstreamError(status: number, details: string): string {
  const normalizedDetails = details.toLowerCase();

  if (
    status === 524 ||
    normalizedDetails.includes('a timeout occurred') ||
    normalizedDetails.includes('error code 524')
  ) {
    return 'Right Codes timed out while generating the image. Please try again.';
  }

  if (normalizedDetails.includes('excessive system load')) {
    return 'Right Codes is temporarily overloaded. Please try again.';
  }

  try {
    const parsed = JSON.parse(details);
    const message = parsed?.error?.message || parsed?.message;
    if (message) {
      return String(message);
    }
  } catch {
    // Fall through to a generic message.
  }

  return details.trim() || `Right Codes image generation failed with status ${status}.`;
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getRightCodesRetryDelayMs(attempt: number): number {
  return 1200 * (2 ** attempt);
}

function getRightCodesTransportErrorCode(error: unknown): string | undefined {
  if (!error || typeof error !== 'object') {
    return undefined;
  }

  const candidate = error as {
    code?: unknown;
    cause?: {
      code?: unknown;
    };
  };

  if (typeof candidate.code === 'string' && candidate.code) {
    return candidate.code;
  }

  if (typeof candidate.cause?.code === 'string' && candidate.cause.code) {
    return candidate.cause.code;
  }

  return undefined;
}

function shouldRetryRightCodesTransportError(error: unknown): boolean {
  const code = getRightCodesTransportErrorCode(error);
  if (code && ['ECONNRESET', 'ETIMEDOUT', 'ECONNREFUSED', 'EAI_AGAIN', 'ENOTFOUND'].includes(code)) {
    return true;
  }

  const message =
    error instanceof Error
      ? error.message.toLowerCase()
      : String(error ?? '').toLowerCase();

  return (
    message.includes('fetch failed') ||
    message.includes('timed out') ||
    message.includes('socket hang up') ||
    message.includes('network error')
  );
}

function normalizeRightCodesTransportError(error: unknown): string {
  if (shouldRetryRightCodesTransportError(error)) {
    return 'Connection to Right Codes was interrupted. Please try again.';
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return 'Right Codes image generation failed before a response was returned.';
}

export async function postRightCodesGenerationRequest(
  options: PostRightCodesGenerationRequestOptions,
): Promise<any> {
  const fetchImpl = options.fetchImpl ?? fetch;
  const sleep = options.sleep ?? delay;
  const maxAttempts = Math.max(1, options.maxAttempts ?? 4);
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    let response: RightCodesResponseLike;

    try {
      response = await fetchImpl('https://www.right.codes/draw/v1/images/generations', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${options.apiKey}`,
          'Content-Type': 'application/json',
          'User-Agent': 'aistudio-build',
        },
        body: JSON.stringify(options.requestBody),
      });
    } catch (error) {
      lastError = new Error(normalizeRightCodesTransportError(error));

      if (!shouldRetryRightCodesTransportError(error) || attempt === maxAttempts - 1) {
        throw lastError;
      }

      await sleep(getRightCodesRetryDelayMs(attempt));
      continue;
    }

    if (response.ok) {
      return response.json();
    }

    const details = await response.text();
    lastError = new Error(normalizeRightCodesUpstreamError(response.status, details));

    if (!shouldRetryRightCodesUpstreamError(response.status, details) || attempt === maxAttempts - 1) {
      throw lastError;
    }

    await sleep(getRightCodesRetryDelayMs(attempt));
  }

  throw lastError || new Error('Right Codes image generation failed.');
}
