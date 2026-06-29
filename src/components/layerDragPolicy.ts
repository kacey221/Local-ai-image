import type { CanvasTool } from '../types';

const LAYER_DRAG_THRESHOLD = 4;

export interface LayerDragStartInput {
  button: number;
  locked: boolean;
  tool: CanvasTool;
}

export interface LayerDragThresholdInput {
  dx: number;
  dy: number;
}

export function isPrimaryLayerDragButton(button: number): boolean {
  return button === 0;
}

export function shouldStartLayerDrag(input: LayerDragStartInput): boolean {
  return isPrimaryLayerDragButton(input.button) && !input.locked && input.tool === 'select';
}

export function hasExceededLayerDragThreshold(input: LayerDragThresholdInput): boolean {
  return Math.hypot(input.dx, input.dy) >= LAYER_DRAG_THRESHOLD;
}
