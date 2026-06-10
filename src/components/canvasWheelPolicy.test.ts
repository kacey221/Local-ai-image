import assert from 'node:assert/strict';
import test from 'node:test';
import { shouldHandleCanvasWheel } from './canvasWheelPolicy';

test('handles ctrl+wheel only on the blank canvas surface', () => {
  assert.equal(
    shouldHandleCanvasWheel({
      ctrlKey: true,
      isOnBlankCanvas: true,
      isInsideInteractiveOverlay: false,
    }),
    true,
  );

  assert.equal(
    shouldHandleCanvasWheel({
      ctrlKey: true,
      isOnBlankCanvas: false,
      isInsideInteractiveOverlay: false,
    }),
    false,
  );

  assert.equal(
    shouldHandleCanvasWheel({
      ctrlKey: true,
      isOnBlankCanvas: true,
      isInsideInteractiveOverlay: true,
    }),
    false,
  );

  assert.equal(
    shouldHandleCanvasWheel({
      ctrlKey: false,
      isOnBlankCanvas: true,
      isInsideInteractiveOverlay: false,
    }),
    false,
  );
});
