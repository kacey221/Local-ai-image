# Dynamic Preview Sizing Design

**Date:** 2026-05-27

**Goal:** Make the upper preview area in generation cards resize with the selected aspect ratio so the preview content displays completely.

## Problem

Generation cards currently use a fixed `220px` preview height for:

- selected generation cards
- unselected generation cards
- the crop overlay region

This causes non-square aspect ratios to feel cramped or cropped, especially taller formats like `3:4` and `9:16`.

## Approved Behavior

- The upper preview area should change height when the user changes the aspect ratio.
- The selected and unselected generation card previews should both follow the current ratio.
- Generated images should display fully inside the preview area instead of being cropped.
- The empty placeholder state should also use the same dynamic preview area.

## Approach

Introduce a small preview layout helper that:

- maps the supported aspect ratios to width/height pairs
- calculates the correct preview height from the current card width
- supports selected cards by subtracting inner padding before computing height

The card preview container will use that computed height instead of the fixed `220px` value.

## Rendering Rules

- Selected generation cards:
  - preview height derives from `node.width - 16`
  - image uses `object-contain`
- Unselected generation cards:
  - preview height derives from `node.width`
  - image uses `object-contain`
- Crop overlay:
  - preview overlay height matches the selected preview height

## Non-Goals

- No change to the aspect-ratio dropdown values
- No change to reference node preview sizing
- No change to image generation request payloads

## Testing Strategy

Add a focused helper test to verify:

- `1:1` produces a square preview
- `3:4` produces a taller preview than `1:1`
- selected cards account for inner padding
- `16:9` produces a shorter preview than `1:1`
