import type { ConnectedReferenceItem } from './referenceConnections';

const REFERENCE_MENTION_PATTERN = /@参考图\s*(\d+)/g;

export interface ResolvedReferenceBindings {
  selectedReferences: ConnectedReferenceItem[];
  mentionLabelNumbers: number[];
  geminiBindingNote?: string;
  rightCodesBindingNote?: string;
}

export function parseReferenceMentionLabelNumbers(prompt: string): number[] {
  const matches = prompt.matchAll(REFERENCE_MENTION_PATTERN);
  const labelNumbers: number[] = [];
  const seen = new Set<number>();

  for (const match of matches) {
    const labelNumber = Number(match[1]);
    if (!Number.isInteger(labelNumber) || labelNumber <= 0 || seen.has(labelNumber)) {
      continue;
    }

    seen.add(labelNumber);
    labelNumbers.push(labelNumber);
  }

  return labelNumbers;
}

export function resolveReferenceBindings(
  connectedReferences: ConnectedReferenceItem[],
  prompt: string,
): ResolvedReferenceBindings {
  const referencedLabelNumbers = parseReferenceMentionLabelNumbers(prompt);
  const referencesWithImages = connectedReferences.filter((item) => item.reference.src);
  const connectedByLabel = new Map(referencesWithImages.map((item) => [item.labelNumber, item]));
  const explicitlySelected = referencedLabelNumbers.flatMap((labelNumber) => {
    const reference = connectedByLabel.get(labelNumber);
    return reference ? [reference] : [];
  });

  const selectedReferences = explicitlySelected.length > 0 ? explicitlySelected : referencesWithImages;
  const selectedLabelNumbers = selectedReferences.map((item) => item.labelNumber);

  return {
    selectedReferences,
    mentionLabelNumbers: selectedLabelNumbers,
    geminiBindingNote: buildGeminiReferenceBindingNote(selectedLabelNumbers),
    rightCodesBindingNote: buildRightCodesReferenceBindingNote(selectedLabelNumbers),
  };
}

function buildGeminiReferenceBindingNote(labelNumbers: number[]): string | undefined {
  if (labelNumbers.length === 0) {
    return undefined;
  }

  const mappingText = labelNumbers
    .map((labelNumber, index) => `第${index + 1}张输入参考图对应@参考图${labelNumber}`)
    .join('；');

  return `参考图绑定：${mappingText}。请严格按编号理解各参考图。`;
}

function buildRightCodesReferenceBindingNote(labelNumbers: number[]): string | undefined {
  if (labelNumbers.length === 0) {
    return undefined;
  }

  const mappingText = labelNumbers
    .map((labelNumber) => `编号${labelNumber}对应@参考图${labelNumber}`)
    .join('；');

  return `参考图绑定：${mappingText}。请严格按编号理解参考拼图中的各区域。`;
}
