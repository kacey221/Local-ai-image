import assert from 'node:assert/strict';
import test from 'node:test';
import type { CanvasLayer } from '../types';
import { getConnectedReferences } from './referenceConnections';

function createLayer(overrides: Partial<CanvasLayer> & Pick<CanvasLayer, 'id' | 'name'>): CanvasLayer {
  return {
    id: overrides.id,
    type: 'image',
    name: overrides.name,
    x: 0,
    y: 0,
    width: 320,
    height: 320,
    visible: true,
    locked: false,
    opacity: 1,
    rotate: 0,
    ...overrides,
  };
}

test('returns only connected references and preserves their original reference numbers', () => {
  const ref1 = createLayer({ id: 'ref-1', name: 'Reference 1', isReference: true });
  const ref2 = createLayer({ id: 'ref-2', name: 'Reference 2', isReference: true });
  const ref3 = createLayer({ id: 'ref-3', name: 'Reference 3', isReference: true });
  const generationNode = createLayer({
    id: 'node-1',
    name: 'Generation Node',
    parentIds: ['ref-2', 'ref-3'],
  });

  const connected = getConnectedReferences([ref1, generationNode, ref2, ref3], generationNode);

  assert.deepEqual(
    connected.map((item) => ({
      id: item.reference.id,
      labelNumber: item.labelNumber,
    })),
    [
      { id: 'ref-2', labelNumber: 2 },
      { id: 'ref-3', labelNumber: 3 },
    ],
  );
});

test('treats parentId as a valid connection even when parentIds is missing', () => {
  const ref1 = createLayer({ id: 'ref-1', name: 'Reference 1', isReference: true });
  const ref2 = createLayer({ id: 'ref-2', name: 'Reference 2', isReference: true });
  const generationNode = createLayer({
    id: 'node-2',
    name: 'Generation Node',
    parentId: 'ref-1',
  });

  const connected = getConnectedReferences([ref1, ref2, generationNode], generationNode);

  assert.deepEqual(
    connected.map((item) => ({
      id: item.reference.id,
      labelNumber: item.labelNumber,
    })),
    [{ id: 'ref-1', labelNumber: 1 }],
  );
});
