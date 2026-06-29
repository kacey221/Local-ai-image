import assert from 'node:assert/strict';
import test from 'node:test';
import type { CanvasLayer } from '../types';
import type { ConnectedReferenceItem } from './referenceConnections';
import { buildGenerationReferencePayload } from './referenceRequest';

function createLayer(overrides: Partial<CanvasLayer> & Pick<CanvasLayer, 'id' | 'name'>): CanvasLayer {
  return {
    id: overrides.id,
    type: 'image',
    name: overrides.name,
    x: 0,
    y: 0,
    width: 320,
    height: 320,
    src: `data:image/png;base64,${overrides.id}`,
    visible: true,
    locked: false,
    opacity: 1,
    rotate: 0,
    ...overrides,
  };
}

function createReference(labelNumber: number): ConnectedReferenceItem {
  return {
    labelNumber,
    reference: createLayer({
      id: `ref-${labelNumber}`,
      name: `Reference ${labelNumber}`,
      isReference: true,
    }),
  };
}

test('builds a Right Codes contact sheet payload in mention order', async () => {
  let composerInput: Array<{ labelNumber: number; src: string }> = [];

  const payload = await buildGenerationReferencePayload({
    engine: 'rightcodes-image',
    prompt: '请融合 @参考图2 和 @参考图1',
    connectedReferences: [createReference(1), createReference(2), createReference(3)],
    composeRightCodesReferenceSheet: async (items) => {
      composerInput = items;
      return 'data:image/png;base64,contact-sheet';
    },
  });

  assert.deepEqual(composerInput, [
    { labelNumber: 2, src: 'data:image/png;base64,ref-2' },
    { labelNumber: 1, src: 'data:image/png;base64,ref-1' },
  ]);
  assert.equal(payload.referenceImage, 'data:image/png;base64,contact-sheet');
  assert.match(payload.referenceBindingNote || '', /编号2对应@参考图2/);
});

test('falls back to all connected references when the prompt has no @参考图 mentions', async () => {
  let composerInput: Array<{ labelNumber: number; src: string }> = [];

  const payload = await buildGenerationReferencePayload({
    engine: 'rightcodes-image',
    prompt: '请综合这些参考图',
    connectedReferences: [createReference(1), createReference(2)],
    composeRightCodesReferenceSheet: async (items) => {
      composerInput = items;
      return 'data:image/png;base64,contact-sheet';
    },
  });

  assert.deepEqual(composerInput, [
    { labelNumber: 1, src: 'data:image/png;base64,ref-1' },
    { labelNumber: 2, src: 'data:image/png;base64,ref-2' },
  ]);
  assert.equal(payload.referenceImage, 'data:image/png;base64,contact-sheet');
});

test('defaults to a direct Right Codes reference image when no engine is provided', async () => {
  const payload = await buildGenerationReferencePayload({
    prompt: '请参考 @参考图1',
    connectedReferences: [createReference(1)],
  });

  assert.equal(payload.referenceImage, 'data:image/png;base64,ref-1');
  assert.equal(payload.referenceImages, undefined);
  assert.match(payload.referenceBindingNote || '', /@参考图1/);
});

test('defaults to a Right Codes contact sheet when multiple references are selected without an engine override', async () => {
  let composerInput: Array<{ labelNumber: number; src: string }> = [];

  const payload = await buildGenerationReferencePayload({
    prompt: '请组合 @参考图2 和 @参考图1',
    connectedReferences: [createReference(1), createReference(2)],
    composeRightCodesReferenceSheet: async (items) => {
      composerInput = items;
      return 'data:image/png;base64,contact-sheet';
    },
  });

  assert.deepEqual(composerInput, [
    { labelNumber: 2, src: 'data:image/png;base64,ref-2' },
    { labelNumber: 1, src: 'data:image/png;base64,ref-1' },
  ]);
  assert.equal(payload.referenceImage, 'data:image/png;base64,contact-sheet');
  assert.equal(payload.referenceImages, undefined);
});

test('keeps a single Right Codes reference image direct', async () => {
  let composerCalled = false;

  const payload = await buildGenerationReferencePayload({
    engine: 'rightcodes-image',
    prompt: '请参考 @参考图1',
    connectedReferences: [createReference(1)],
    composeRightCodesReferenceSheet: async () => {
      composerCalled = true;
      return 'data:image/png;base64,contact-sheet';
    },
  });

  assert.equal(payload.referenceImage, 'data:image/png;base64,ref-1');
  assert.equal(composerCalled, false);
});

test('composes a Right Codes contact sheet when multiple references are selected', async () => {
  let composerInput: Array<{ labelNumber: number; src: string }> = [];

  const payload = await buildGenerationReferencePayload({
    engine: 'rightcodes-image',
    prompt: '请组合 @参考图2 和 @参考图1',
    connectedReferences: [createReference(1), createReference(2)],
    composeRightCodesReferenceSheet: async (items) => {
      composerInput = items;
      return 'data:image/png;base64,contact-sheet';
    },
  });

  assert.deepEqual(composerInput, [
    { labelNumber: 2, src: 'data:image/png;base64,ref-2' },
    { labelNumber: 1, src: 'data:image/png;base64,ref-1' },
  ]);
  assert.equal(payload.referenceImage, 'data:image/png;base64,contact-sheet');
  assert.match(payload.referenceBindingNote || '', /编号2对应@参考图2/);
});
