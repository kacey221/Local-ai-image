export interface ZoomStateInput {
  scale: number;
  panOffset: { x: number; y: number };
  pointer: { x: number; y: number };
  factor: number;
  minScale?: number;
  maxScale?: number;
}

export interface ZoomStateOutput {
  scale: number;
  panOffset: { x: number; y: number };
}

export function clampScale(scale: number, minScale = 0.15, maxScale = 3.5): number {
  return Math.min(Math.max(scale, minScale), maxScale);
}

export function computeZoomState(input: ZoomStateInput): ZoomStateOutput {
  const nextScale = clampScale(
    input.scale * input.factor,
    input.minScale,
    input.maxScale,
  );

  const canvasPointX = (input.pointer.x - input.panOffset.x) / input.scale;
  const canvasPointY = (input.pointer.y - input.panOffset.y) / input.scale;

  return {
    scale: nextScale,
    panOffset: {
      x: input.pointer.x - canvasPointX * nextScale,
      y: input.pointer.y - canvasPointY * nextScale,
    },
  };
}
