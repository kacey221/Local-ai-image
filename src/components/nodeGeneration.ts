import type { CanvasLayer } from '../types';

export function applyGeneratedImageToNode(
  node: CanvasLayer,
  src: string,
  dims: { w: number; h: number },
): CanvasLayer {
  return {
    ...node,
    src,
    width: dims.w,
    height: dims.h,
  };
}
