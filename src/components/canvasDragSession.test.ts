import assert from 'node:assert/strict';
import test from 'node:test';
import type { CanvasLayer } from '../types';
import { getPreviewLayer, getPreviewPanOffset } from './canvasDragSession';

const baseLayer: CanvasLayer = {
  id: 'layer-1',
  type: 'image',
  name: 'Layer 1',
  x: 10,
  y: 20,
  width: 160,
  height: 120,
  visible: true,
  locked: false,
  opacity: 1,
  rotate: 0,
};

test('getPreviewPanOffset prefers live coordinates while panning', () => {
  assert.deepEqual(
    getPreviewPanOffset(
      { x: 80, y: 100 },
      true,
      { x: 140, y: 180 },
    ),
    { x: 140, y: 180 },
  );
});

test('getPreviewPanOffset keeps committed coordinates while idle', () => {
  assert.deepEqual(
    getPreviewPanOffset(
      { x: 80, y: 100 },
      false,
      { x: 140, y: 180 },
    ),
    { x: 80, y: 100 },
  );
});

test('getPreviewLayer returns a temporary moved layer during drag', () => {
  assert.deepEqual(
    getPreviewLayer(baseLayer, true, { id: 'layer-1', x: 44, y: 55 }),
    {
      ...baseLayer,
      x: 44,
      y: 55,
    },
  );
});

test('getPreviewLayer keeps the committed layer when drag is inactive', () => {
  assert.equal(
    getPreviewLayer(baseLayer, false, { id: 'layer-1', x: 44, y: 55 }),
    baseLayer,
  );
});

test('getPreviewLayer ignores live coordinates for other layers', () => {
  assert.equal(
    getPreviewLayer(baseLayer, true, { id: 'layer-2', x: 44, y: 55 }),
    baseLayer,
  );
});
