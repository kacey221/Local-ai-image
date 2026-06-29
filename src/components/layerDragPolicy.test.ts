import assert from 'node:assert/strict';
import test from 'node:test';

import {
  hasExceededLayerDragThreshold,
  shouldStartLayerDrag,
} from './layerDragPolicy';

test('only starts layer drag from the primary mouse button', () => {
  assert.equal(shouldStartLayerDrag({ button: 0, locked: false, tool: 'select' }), true);
  assert.equal(shouldStartLayerDrag({ button: 2, locked: false, tool: 'select' }), false);
});

test('does not start layer drag when the layer is locked', () => {
  assert.equal(shouldStartLayerDrag({ button: 0, locked: true, tool: 'select' }), false);
});

test('does not start layer drag when the current tool is not select', () => {
  assert.equal(shouldStartLayerDrag({ button: 0, locked: false, tool: 'pan' }), false);
});

test('requires pointer movement beyond the drag threshold', () => {
  assert.equal(hasExceededLayerDragThreshold({ dx: 1, dy: 1 }), false);
  assert.equal(hasExceededLayerDragThreshold({ dx: 6, dy: 0 }), true);
});
