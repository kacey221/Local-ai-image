import type { CanvasLayer } from '../types';

export interface OutputPortVisibilityInput {
  isSelected: boolean;
  layerType: CanvasLayer['type'];
}

export function shouldShowOutputPort(input: OutputPortVisibilityInput): boolean {
  return input.isSelected && input.layerType === 'image';
}
