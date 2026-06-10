# Connected Reference Visibility Design

**Date:** 2026-05-27

**Goal:** Only show reference images inside a selected image-generation card when those references are actually connected to that card.

## Problem

The current generation card UI renders all reference nodes from the canvas in two places:

- The thumbnail strip at the top of the selected generation card
- The `@参考图` mention dropdown above the prompt field

This makes the card suggest that every reference image is active for the card, even when the user has not connected those references.

## Approved Behavior

- Only references connected to the current generation card should appear in the thumbnail strip.
- Only references connected to the current generation card should appear in the `@参考图` dropdown.
- Reference numbering should stay stable relative to the full canvas reference list. Hidden references are not renumbered.
- No new picker or fallback UI will be added in this change. If a user wants a new reference to appear, they must connect it first.

## Approach

Use the card's existing connection state (`parentId` and `parentIds`) as the source of truth. Derive a connected-reference list once for the selected card and reuse that list in both UI surfaces.

To keep the logic testable, extract a small helper that:

- Finds connected reference nodes for a generation card
- Preserves the original canvas ordering
- Attaches the stable reference label number used by the UI and prompt mentions

## Data Flow

1. Start from `layers`.
2. Filter to reference nodes.
3. Filter again to only references whose ids are present in the current card's connection fields.
4. Render the thumbnail strip from that connected list only.
5. Render the `@参考图` dropdown from that same connected list only.

## Edge Cases

- If a card has no connected references, the thumbnail strip should render nothing.
- If a card has no connected references, the `@参考图` dropdown should show the empty state instead of listing all canvas references.
- If `parentId` is set and `parentIds` is empty or missing, the helper still treats that reference as connected.
- If `parentIds` contains multiple references, all connected references are shown in original canvas order.

## Testing Strategy

Add a focused test around the extracted helper so we can verify:

- Unconnected references are excluded
- Connected references are included
- Labels remain based on original canvas position instead of being renumbered after filtering
- `parentId` and `parentIds` both participate in connection detection
