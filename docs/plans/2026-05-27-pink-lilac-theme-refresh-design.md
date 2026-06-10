# Pink Lilac Theme Refresh Design

**Date:** 2026-05-27

**Goal:** Refresh the UI so the prompt-card lower section becomes white and the main purple/blue accents shift to a soft pink-lilac gradient palette.

## Problem

Two areas currently feel visually off from the requested direction:

- The lower prompt-card control section uses a dark navy surface
- The top-level brand and action accents still rely on stronger purple/blue tones

## Approved Scope

- Make the lower prompt-card control section white
- Shift the key purple/blue accents in the upper workspace UI to a soft pink-lilac gradient
- Keep layout, copy, and interactions unchanged

## Approach

Introduce a tiny shared theme-token module for the new gradient and prompt-card surface styles. This keeps the color decisions centralized and gives us a minimal test seam before updating the class strings in `App.tsx` and `CanvasWorkspace.tsx`.

## Figure 1 Changes

- Convert the prompt-card lower section to a white surface
- Update nested controls inside that section to light backgrounds, slate text, and subtle rose hover states
- Keep the section structure intact

## Figure 2 Changes

- Update logo gradient
- Update top primary actions and active workspace tab accents
- Update key selected tool states so they match the same soft pink-lilac direction

## Testing Strategy

Add a focused theme-token test to verify:

- the prompt-card surface token includes a white background
- the accent gradient token includes rose, fuchsia, and violet classes
