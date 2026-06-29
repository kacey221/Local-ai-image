export function fitImportedImageDimensions(
  naturalWidth: number,
  naturalHeight: number,
  maxLongEdge = 520,
): { width: number; height: number } {
  if (naturalWidth <= 0 || naturalHeight <= 0) {
    return { width: 320, height: 320 };
  }

  const longestEdge = Math.max(naturalWidth, naturalHeight);
  const scale = Math.min(1, maxLongEdge / longestEdge);

  return {
    width: Math.round(naturalWidth * scale),
    height: Math.round(naturalHeight * scale),
  };
}
