export interface CanvasInteractionPresentationInput {
  isPanning: boolean;
  isMovingLayer: boolean;
  isResizingLayer: boolean;
  isDrawing: boolean;
  isResizingCropBox: boolean;
  draggingCableFrom: string | null;
}

export interface CanvasInteractionPresentation {
  isInteracting: boolean;
  showExpandedSelectionChrome: boolean;
  enableAmbientMotion: boolean;
  enableGlassEffects: boolean;
  enableConnectionFlowAnimation: boolean;
  enableNodeTransitions: boolean;
}

export function getCanvasInteractionPresentation(
  input: CanvasInteractionPresentationInput,
): CanvasInteractionPresentation {
  const isInteracting =
    input.isPanning ||
    input.isMovingLayer ||
    input.isResizingLayer ||
    input.isDrawing ||
    input.isResizingCropBox ||
    input.draggingCableFrom !== null;

  const enableFullPresentation = !isInteracting;

  return {
    isInteracting,
    showExpandedSelectionChrome: enableFullPresentation,
    enableAmbientMotion: enableFullPresentation,
    enableGlassEffects: enableFullPresentation,
    enableConnectionFlowAnimation: enableFullPresentation,
    enableNodeTransitions: enableFullPresentation,
  };
}
