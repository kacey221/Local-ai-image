# In-Place Node Generation Design

**Date:** 2026-05-27

**Goal:** Make node-based image generation write the generated image back into the current prompt card instead of creating a new child card.

## Problem

The current node generation flow creates a brand-new image node after each successful generation. The user wants the image result to appear in the current prompt card they are editing, without adding another node.

## Approved Scope

- Apply this change only to the node-based prompt card generation flow in `CanvasWorkspace`
- Do not change the top-level app generation history behavior
- Do not change redraw, upscale, outpaint, crop, or history import behavior

## Approved Behavior

- When the user clicks generate from a prompt card, the returned image replaces the current card's `src`
- The current card keeps its existing `id`, position, prompt, connections, and model settings
- The current card's `width` and `height` should update to match the selected aspect ratio dimensions
- No new child card is created for this generation path

## Approach

Extract the node generation success behavior into a tiny helper that receives the current node, aspect-ratio dimensions, and generated image source, then returns the updated node. This keeps the state update rule testable and lets the UI handler stay small.

## Non-Goals

- No change to image-to-image editing flows that intentionally spawn derivative nodes
- No change to history drawer imports
- No change to multi-node connection logic

## Testing Strategy

Add a focused helper test to verify:

- the current node id is preserved
- the generated image replaces `src`
- width and height update to the selected aspect ratio dimensions
- prompt and parent connections remain intact
