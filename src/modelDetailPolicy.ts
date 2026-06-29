import type { DetailLevel, RightCodesModel } from './types';

const MODEL_DETAIL_LEVELS: Readonly<Record<RightCodesModel, readonly DetailLevel[]>> = {
  'gpt-image-2': ['1K'],
  'gpt-image-2-vip': ['1K', '2K', '4K'],
  'nano-banana': ['1K'],
  'nano-banana-2': ['1K', '2K', '4K'],
  'nano-banana-pro': ['1K', '2K', '4K'],
};

export function getSupportedDetailLevelsForModel(model: RightCodesModel): DetailLevel[] {
  return [...MODEL_DETAIL_LEVELS[model]];
}

export function coerceDetailLevelForModel(
  model: RightCodesModel,
  detailLevel?: DetailLevel,
): DetailLevel {
  const supportedDetailLevels = MODEL_DETAIL_LEVELS[model];

  if (detailLevel && supportedDetailLevels.includes(detailLevel)) {
    return detailLevel;
  }

  return supportedDetailLevels[0];
}
