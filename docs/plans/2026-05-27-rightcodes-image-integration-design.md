# Right Codes Image Generation Integration Design

**Date:** 2026-05-27

**Goal:** Add the Right Codes image generation API to the app as a separate backend route and a new selectable engine for generation nodes.

## Problem

The app currently supports Gemini and Imagen-based image generation only. The user wants the Right Codes Draw image generation API added without replacing the existing Gemini route.

## Approved Scope

- Add a new backend route: `/api/rightcodes/generate-image`
- Add a new engine option for generation nodes: `rightcodes-image`
- Keep the current Gemini route untouched
- Reuse the current node generation UX and response shape (`images: string[]`)
- Use the first connected reference image, if any, as the optional Right Codes `image` input

## External API Contract

According to the Right Codes Draw documentation:

- Base URL: `https://www.right.codes/draw`
- Endpoint: `POST /v1/images/generations`
- Auth header: `Authorization: Bearer sk-xxxxx`
- Required request fields: `model`, `prompt`
- Optional request fields: `image`, `size`, `response_format`
- `image` supports base64 or URL
- `size` is a pixel string such as `1024x1024`
- Example response returns `data[].url`

Because the parameter table describes `image` as a single field, this integration will send a single image string. The docs example shows `image: []`, which appears inconsistent with the field description, so this implementation follows the table and treats the field as singular.

## Approach

Introduce a small server-side helper module that owns all Right Codes-specific behavior:

- Aspect ratio to pixel size mapping
- Prompt shaping when a negative prompt exists
- Reference image normalization for base64 vs URL input
- Remote image URL to data URL conversion

The Express route will use that helper to:

1. Build the Right Codes request body
2. Call the Right Codes API
3. Download returned image URLs
4. Convert them into data URLs
5. Return the same `{ success, images }` structure the frontend already expects

## Frontend Behavior

- The generation node engine dropdown gets a new option: `Right Codes`
- When a node uses `rightcodes-image`, node generation posts to `/api/rightcodes/generate-image`
- The first connected reference image is passed as `referenceImage`
- Other engines continue using `/api/gemini/generate-image`

## Configuration

- Add `RIGHTCODES_API_KEY` to `.env.example`
- Extend `/api/config-status` to include a Right Codes key flag while preserving the existing `hasKey` field for compatibility

## Edge Cases

- No `RIGHTCODES_API_KEY`: the route returns a clear server error
- No connected reference image: omit the `image` field entirely
- Data URL reference image: strip the `data:*;base64,` prefix before sending
- Remote URL reference image: forward the URL directly
- Empty `data` array or missing `url`: return a clear error
- Image download without `content-type`: fall back to `image/png`

## Testing Strategy

Add focused tests for the helper module:

- Aspect ratio maps to the expected Right Codes `size`
- Negative prompt is merged into the prompt text
- Data URL reference images are normalized to raw base64
- Plain URL reference images stay unchanged
- Binary image bytes are converted back into a valid data URL
