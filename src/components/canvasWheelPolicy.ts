export interface CanvasWheelPolicyInput {
  ctrlKey: boolean;
  isOnBlankCanvas: boolean;
  isInsideInteractiveOverlay: boolean;
}

export function shouldHandleCanvasWheel(input: CanvasWheelPolicyInput): boolean {
  return input.ctrlKey && input.isOnBlankCanvas && !input.isInsideInteractiveOverlay;
}
