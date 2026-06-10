# Right Codes Fixed Aspect Ratios and Auto Size Design

**Date:** 2026-05-28

**Goal:** Make Right Codes generation honor the node's selected output mode so fixed ratios stay fixed, and add an `auto` mode that preserves the model's natural aspect ratio.

## Problem

The current Right Codes integration maps node ratios like `3:4` and `9:16` to custom pixel sizes such as `1024x1365` and `1024x1820`. Those sizes are not part of the OpenAI-compatible image size set that Right Codes follows for `gpt-image-2`, so the upstream API can reject them with `Invalid size, please check the size`.

This becomes especially confusing when a node is connected to one or more reference images. The user expects the reference images to influence content only, while the selected node ratio remains the single source of truth for output framing.

## Approved Scope

- Keep `1:1`, `3:4`, `4:3`, `9:16`, and `16:9` as fixed output modes.
- Add `auto` as a new selectable output mode for generation nodes.
- For fixed output modes, send only OpenAI-official supported request sizes to Right Codes.
- After a fixed-ratio image returns, crop it on the client to the exact requested ratio before writing it back to the node.
- For `auto`, send `size: "auto"` and preserve the model's returned image ratio without post-cropping.
- Keep reference images as content guidance only. They must not change the chosen output mode.

## Rejected Alternatives

### Send the old custom sizes and hope different models accept them

This leaves the current failure mode in place and does not align with the upstream size contract.

### Force `auto` for every referenced generation

This would make the API request more permissive, but it breaks the user's expectation that selecting `3:4` or `16:9` produces that framing exactly.

### Restrict the UI to only upstream-native ratios

This would remove useful output options and is a poor fit for the existing canvas workflow, which already treats ratios like `3:4` and `9:16` as first-class choices.

## Approach

Split Right Codes sizing into two layers:

1. **Request size**: the legal size string sent to the upstream API
2. **Final output ratio**: the exact framing that the node should display after generation

For fixed ratios, the server will map them to the closest supported OpenAI-style size:

- `1:1 -> 1024x1024`
- `3:4 -> 1024x1536`
- `4:3 -> 1536x1024`
- `9:16 -> 1024x1536`
- `16:9 -> 1536x1024`
- `auto -> auto`

This keeps upstream requests valid. When the response arrives:

- fixed ratios are center-cropped to the exact target ratio
- `auto` is left untouched

## Frontend Behavior

- The node ratio dropdown gets a new `auto` option.
- Fixed-ratio nodes continue to display with the existing preset canvas card sizes.
- `auto` nodes start with the selected placeholder card size but, after generation, resize to a fitted version of the returned image's true width and height.
- Preview sizing should respect actual node dimensions for generated `auto` images so the card preview matches the result.

## Client Post-Processing

Add a small helper module that owns generated-image framing rules:

- determine whether a ratio is fixed or `auto`
- compute the exact center-crop rectangle for a returned image and target ratio
- fit `auto` results into a reasonable node display size while preserving the true image ratio

This keeps the canvas component from embedding image math directly in the submit handler.

## Backend Changes

Update the Right Codes helper module so it:

- supports the new `auto` ratio value
- maps fixed ratios to supported upstream request sizes
- stops emitting the current unsupported custom sizes

The existing route shape stays the same: `/api/rightcodes/generate-image` still returns `{ success, images }`.

## Edge Cases

- Fixed ratio selected but upstream returns a slightly different pixel size:
  crop based on the actual returned image dimensions, not the requested size string.
- `auto` selected with a portrait or landscape result:
  preserve the original ratio and fit the node dimensions proportionally.
- Missing or unreadable returned image dimensions:
  fall back to the existing node sizing instead of crashing the generation flow.
- Multiple connected references:
  continue using only the first connected reference image, unchanged by this fix.

## Testing Strategy

Add focused tests for:

- Right Codes request-size mapping, including `auto`
- preview height behavior for `auto` nodes using real image dimensions
- fixed-ratio crop math for portrait and landscape results
- fitted `auto` node sizing that preserves the model-returned aspect ratio
