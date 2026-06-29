import type { CanvasLayer } from '../types';
import type { ConnectedReferenceItem } from './referenceConnections';
import { resolveReferenceBindings } from './referenceBindings';

export interface RightCodesReferenceSheetItem {
  labelNumber: number;
  src: string;
}

interface BuildGenerationReferencePayloadParams {
  connectedReferences: ConnectedReferenceItem[];
  engine?: CanvasLayer['engine'];
  prompt: string;
  composeRightCodesReferenceSheet?: (items: RightCodesReferenceSheetItem[]) => Promise<string>;
}

export interface GenerationReferencePayload {
  referenceBindingNote?: string;
  referenceImage?: string;
  referenceImages?: string[];
}

export async function buildGenerationReferencePayload(
  params: BuildGenerationReferencePayloadParams,
): Promise<GenerationReferencePayload> {
  const resolved = resolveReferenceBindings(params.connectedReferences, params.prompt);
  const selectedImages = resolved.selectedReferences.flatMap((item) =>
    item.reference.src
      ? [{ labelNumber: item.labelNumber, src: item.reference.src }]
      : [],
  );

  if (selectedImages.length === 0) {
    return {};
  }

  if (selectedImages.length === 1) {
    return {
      referenceBindingNote: resolved.rightCodesBindingNote,
      referenceImage: selectedImages[0].src,
    };
  }

  if (!params.composeRightCodesReferenceSheet) {
    throw new Error('A Right Codes contact-sheet composer is required for multiple reference images.');
  }

  return {
    referenceBindingNote: resolved.rightCodesBindingNote,
    referenceImage: await params.composeRightCodesReferenceSheet(selectedImages),
  };
}
