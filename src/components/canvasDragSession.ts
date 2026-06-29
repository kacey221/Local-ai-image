import type { CanvasLayer } from '../types';

export interface CanvasPoint {
  x: number;
  y: number;
}

export interface LiveLayerPosition extends CanvasPoint {
  id: string;
}

export function getPreviewPanOffset(
  committedPanOffset: CanvasPoint,
  isPanning: boolean,
  livePanOffset: CanvasPoint | null | undefined,
): CanvasPoint {
  if (isPanning && livePanOffset) {
    return livePanOffset;
  }

  return committedPanOffset;
}

export function getPreviewLayer(
  layer: CanvasLayer,
  isMovingLayer: boolean,
  liveLayerPosition: LiveLayerPosition | null | undefined,
): CanvasLayer {
  if (isMovingLayer && liveLayerPosition && liveLayerPosition.id === layer.id) {
    return {
      ...layer,
      x: liveLayerPosition.x,
      y: liveLayerPosition.y,
    };
  }

  return layer;
}
