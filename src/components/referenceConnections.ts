import type { CanvasLayer } from '../types';

export interface ConnectedReferenceItem {
  reference: CanvasLayer;
  labelNumber: number;
}

export function getConnectedReferences(
  layers: CanvasLayer[],
  node: Pick<CanvasLayer, 'parentId' | 'parentIds'>,
): ConnectedReferenceItem[] {
  const connectedIds = new Set<string>();

  if (node.parentId) {
    connectedIds.add(node.parentId);
  }

  for (const parentId of node.parentIds ?? []) {
    connectedIds.add(parentId);
  }

  if (connectedIds.size === 0) {
    return [];
  }

  const referenceLayers = layers.filter((layer) => layer.isReference);

  return referenceLayers.flatMap((reference, index) => {
    if (!connectedIds.has(reference.id)) {
      return [];
    }

    return [
      {
        reference,
        labelNumber: index + 1,
      },
    ];
  });
}
