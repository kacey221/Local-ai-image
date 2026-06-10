import assert from 'node:assert/strict';
import test from 'node:test';
import type { CanvasLayer } from '../types';
import { applyGeneratedImageToNode } from './nodeGeneration';

function createNode(overrides: Partial<CanvasLayer> = {}): CanvasLayer {
  return {
    id: 'node-1',
    type: 'image',
    name: 'Prompt Card',
    x: 100,
    y: 200,
    width: 320,
    height: 320,
    src: '',
    visible: true,
    locked: false,
    opacity: 1,
    rotate: 0,
    prompt: 'test prompt',
    parentId: 'ref-1',
    parentIds: ['ref-1', 'ref-2'],
    engine: 'rightcodes-image',
    rightCodesModel: 'gpt-image-2',
    aspectRatio: '1:1',
    ...overrides,
  };
}

test('writes the generated image back into the current node and preserves its identity', () => {
  const original = createNode();

  const updated = applyGeneratedImageToNode(original, 'data:image/png;base64,abc123', {
    w: 270,
    h: 360,
  });

  assert.equal(updated.id, original.id);
  assert.equal(updated.src, 'data:image/png;base64,abc123');
  assert.equal(updated.width, 270);
  assert.equal(updated.height, 360);
  assert.equal(updated.prompt, original.prompt);
  assert.deepEqual(updated.parentIds, original.parentIds);
  assert.equal(updated.parentId, original.parentId);
  assert.equal(updated.x, original.x);
  assert.equal(updated.y, original.y);
});
