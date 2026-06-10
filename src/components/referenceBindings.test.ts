import assert from 'node:assert/strict';
import test from 'node:test';
import type { CanvasLayer } from '../types';
import type { ConnectedReferenceItem } from './referenceConnections';
import { resolveReferenceBindings } from './referenceBindings';

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

test('resolves explicit @参考图 mentions in prompt order without duplicates', () => {
  const resolved = resolveReferenceBindings(
    [createReference(1), createReference(2), createReference(3)],
    '请结合 @参考图2 的服装和 @参考图1 的角色，不要重复 @参考图2',
  );

  assert.deepEqual(
    resolved.selectedReferences.map((item) => item.labelNumber),
    [2, 1],
  );
  assert.match(resolved.geminiBindingNote, /第1张输入参考图对应@参考图2/);
  assert.match(resolved.geminiBindingNote, /第2张输入参考图对应@参考图1/);
});

test('falls back to all connected references when the prompt has no valid mentions', () => {
  const resolved = resolveReferenceBindings(
    [createReference(1), createReference(2), createReference(3)],
    '请综合这些参考图的气质和配色',
  );

  assert.deepEqual(
    resolved.selectedReferences.map((item) => item.labelNumber),
    [1, 2, 3],
  );
});

test('ignores invalid mentions and falls back to all connected references when none are valid', () => {
  const resolved = resolveReferenceBindings(
    [createReference(1), createReference(2)],
    '请参考 @参考图9 的构图',
  );

  assert.deepEqual(
    resolved.selectedReferences.map((item) => item.labelNumber),
    [1, 2],
  );
});
