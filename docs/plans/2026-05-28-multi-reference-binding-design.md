# Multi-Reference Binding for Gemini and Right Codes Design

**Date:** 2026-05-28

**Goal:** Make `@参考图N` map to real reference images in generation requests so multiple connected references are meaningfully understood by Gemini, while Right Codes receives a numbered contact sheet fallback.

## Problem

The current canvas UI lets users connect multiple reference images and insert `@参考图1`, `@参考图2`, and similar markers into the prompt. However, the actual request pipeline does not preserve that structure:

- the frontend only sends the first connected reference image
- the Gemini route receives text only and no reference images
- the Right Codes route accepts a single `referenceImage` only

This means the model sees ambiguous text markers without a trustworthy image-to-marker binding.

## Approved Scope

- Keep the current connected-reference UI and `@参考图N` typing experience.
- Make Gemini generation accept and forward multiple reference images in the same request.
- Make Right Codes generation support multiple references through a single numbered contact-sheet image.
- Treat connected references as the source pool for generation.
- When the prompt explicitly mentions `@参考图N`, prioritize and order those referenced images first.
- When the prompt contains no `@参考图N`, send all connected reference images.
- Add a generated binding note so the model can associate each `@参考图N` token with the correct image.

## External Capability Constraints

Gemini's official multimodal API supports multiple image parts in a single `generateContent` call, which makes true multi-reference binding viable for that route.

Right Codes Draw currently documents the generation route around a single `image` reference field. Because multi-image support is not clearly documented there, this design uses a stable single-image fallback by composing all selected references into one labeled contact sheet before sending the request.

## Approach

Split the solution into three layers:

1. **Reference selection**
2. **Prompt binding**
3. **Engine-specific request shaping**

### Reference Selection

Create a small helper that takes:

- all connected references for the current node
- the current prompt text

It returns:

- the ordered references that should be sent
- the referenced marker numbers
- a short binding note for the model

Selection rules:

- If the prompt includes `@参考图N`, include the connected references whose stable labels match those numbers, in mention order.
- If the prompt includes no valid reference mentions, include all connected references in their stable UI order.
- Ignore mention numbers that do not correspond to a connected reference.
- Do not duplicate references when the same marker appears more than once.

### Prompt Binding

Prepend a compact instruction block before the user's prompt, for example:

`参考图绑定：@参考图1 对应第1张输入参考图，@参考图2 对应第2张输入参考图。请严格按编号理解各参考图。`

This gives the model a deterministic mapping between prompt markers and the image parts or contact-sheet cells it receives.

### Gemini Request Shaping

Extend `/api/gemini/generate-image` so it can receive a `referenceImages` array.

For Gemini image-generation requests:

- add the binding note as text
- add the user prompt text
- append each reference image as its own image part

This makes Gemini see the prompt and the referenced images together in one structured multimodal request.

### Right Codes Request Shaping

Extend `/api/rightcodes/generate-image` so it can receive a `referenceImages` array.

If more than one reference image is selected:

- combine them into a single numbered contact sheet
- number each tile using the same `@参考图N` labels shown in the UI
- send that composed image as the single `referenceImage`

If exactly one reference image is selected:

- send it directly without composing a contact sheet

The binding note still goes into the prompt so the model can associate `@参考图N` with the numbered regions of the contact sheet.

## Frontend Behavior

- Keep the existing connected-reference thumbnail strip and `@` mention dropdown.
- Change request building so generation sends the selected `referenceImages` array instead of only the first image.
- The UI numbering must remain the single source of truth for reference labels.
- No new visible controls are required in this change.

## Edge Cases

- No connected references: send no reference images and keep generation behavior unchanged.
- Prompt mentions `@参考图9` but only two connected references exist: ignore the invalid mention and fall back to the valid subset.
- Duplicate mention tokens: send each referenced image once.
- Mixed connected and unconnected references: only connected references are eligible.
- Right Codes with one selected reference: skip contact-sheet composition.
- Contact-sheet composition failure: return a clear server error instead of silently dropping images.

## Testing Strategy

Add focused tests for:

- parsing reference mentions from prompt text
- selecting referenced images in stable order
- falling back to all connected references when no mentions exist
- building a binding note with correct numbering
- composing a contact sheet only when more than one reference image is selected
- preserving single-reference behavior for both Gemini and Right Codes
