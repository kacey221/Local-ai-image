import assert from 'node:assert/strict';
import test from 'node:test';

import { getCanvasInteractionPresentation } from './canvasInteractionPresentation';

test('keeps the full presentation while the canvas is idle', () => {
  assert.deepEqual(
    getCanvasInteractionPresentation({
      isPanning: false,
      isMovingLayer: false,
      isResizingLayer: false,
      isDrawing: false,
      isResizingCropBox: false,
      draggingCableFrom: null,
    }),
    {
      isInteracting: false,
      showExpandedSelectionChrome: true,
      enableAmbientMotion: true,
      enableGlassEffects: true,
      enableConnectionFlowAnimation: true,
      enableNodeTransitions: true,
    },
  );
});

test('reduces costly visual effects while moving the canvas surface', () => {
  assert.deepEqual(
    getCanvasInteractionPresentation({
      isPanning: true,
      isMovingLayer: false,
      isResizingLayer: false,
      isDrawing: false,
      isResizingCropBox: false,
      draggingCableFrom: null,
    }),
    {
      isInteracting: true,
      showExpandedSelectionChrome: false,
      enableAmbientMotion: false,
      enableGlassEffects: false,
      enableConnectionFlowAnimation: false,
      enableNodeTransitions: false,
    },
  );
});

test('treats cable dragging as an interaction that pauses ambient motion', () => {
  assert.deepEqual(
    getCanvasInteractionPresentation({
      isPanning: false,
      isMovingLayer: false,
      isResizingLayer: false,
      isDrawing: false,
      isResizingCropBox: false,
      draggingCableFrom: 'layer-1',
    }),
    {
      isInteracting: true,
      showExpandedSelectionChrome: false,
      enableAmbientMotion: false,
      enableGlassEffects: false,
      enableConnectionFlowAnimation: false,
      enableNodeTransitions: false,
    },
  );
});
