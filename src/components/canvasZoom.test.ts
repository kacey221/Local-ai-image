import assert from 'node:assert/strict';
import test from 'node:test';
import { computeZoomState } from './canvasZoom';

test('zooms in around the pointer while keeping the pointed canvas coordinate stable', () => {
  const next = computeZoomState({
    scale: 1,
    panOffset: { x: 80, y: 100 },
    pointer: { x: 200, y: 160 },
    factor: 1.2,
  });

  assert.equal(next.scale, 1.2);
  assert.deepEqual(next.panOffset, { x: 56, y: 88 });
});

test('clamps zoom to the maximum scale before recalculating pan offset', () => {
  const next = computeZoomState({
    scale: 3.4,
    panOffset: { x: 40, y: 50 },
    pointer: { x: 180, y: 150 },
    factor: 1.2,
  });

  assert.equal(next.scale, 3.5);
  assert.ok(Math.abs(next.panOffset.x - 35.882352941176464) < 1e-9);
  assert.ok(Math.abs(next.panOffset.y - 47.05882352941177) < 1e-9);
});
