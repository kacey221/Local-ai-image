import type { CanvasLayer } from '../types';

type SupportedAspectRatio = NonNullable<CanvasLayer['aspectRatio']>;

const PREVIEW_RATIO_DIMS: Record<SupportedAspectRatio, { w: number; h: number }> = {
  '1:1': { w: 320, h: 320 },
  '3:4': { w: 320, h: 427 },
  '4:3': { w: 427, h: 320 },
  '9:16': { w: 320, h: 569 },
  '16:9': { w: 400, h: 225 },
  'auto': { w: 320, h: 320 },
};

export function getPreviewFrameHeight(
  cardWidth: number,
  aspectRatio: SupportedAspectRatio = '1:1',
  horizontalPadding = 0,
  actualDimensions?: { width: number; height: number },
): number {
  const availableWidth = Math.max(1, cardWidth - horizontalPadding);
  if (aspectRatio === 'auto' && actualDimensions?.width && actualDimensions?.height) {
    return Math.round((availableWidth * actualDimensions.height) / actualDimensions.width);
  }

  const dims = PREVIEW_RATIO_DIMS[aspectRatio];
  return Math.round((availableWidth * dims.h) / dims.w);
}
