# Image Import Paste and Drag Design

**Date:** 2026-05-27

**Goal:** Let users paste screenshots, drag image files into the canvas, and import images as reference nodes that preserve the original image aspect ratio and display fully.

## Problem

The current canvas supports file-picker upload only. Imported images are always created as fixed `320x320` reference nodes, which ignores the original image ratio and can crop the preview.

## Approved Behavior

- Pasting a screenshot into the interface creates a new reference node.
- Dragging an image file into the interface creates a new reference node.
- File-picker upload continues to work, but now uses the same import path.
- Imported images are always created as new reference nodes.
- Imported reference nodes are placed in the visible empty canvas area near the current viewport center, with a small stagger offset so repeated imports do not fully overlap.
- Imported node dimensions preserve the original image aspect ratio and display the image fully.

## Approach

Create a unified import pipeline inside `CanvasWorkspace`:

1. Accept image sources from file picker, drag-and-drop, and clipboard paste.
2. Convert each image into a data URL.
3. Read the image's natural width and height.
4. Fit the image into a bounded display size while preserving aspect ratio.
5. Create a new reference node with those fitted dimensions.

## Size Rules

- Preserve the original image aspect ratio.
- Do not enlarge small images.
- Scale down large images so the longest edge stays within a reasonable maximum display size.
- Use the fitted width and height for the reference node itself.
- Show imported reference images with `object-contain` so the full image remains visible.

## Placement Rules

- New imported nodes appear in the visible canvas area, not attached to another node.
- Placement uses the current pan and zoom state so the new node lands in the user's current view.
- Consecutive imports add a small offset to avoid exact overlap.

## Event Handling

- Clipboard paste:
  - listen at window level while the canvas view is active
  - ignore paste when focus is inside an input, textarea, or contenteditable element
- Drag-and-drop:
  - handle dragover and drop on the main canvas viewport container
  - import all dropped image files

## Testing Strategy

Add a focused helper test for image fitting to verify:

- landscape images scale proportionally
- portrait images scale proportionally
- small images are not enlarged
- invalid dimensions fall back safely
