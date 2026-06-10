# Right Codes Fixed Aspect Ratios and Auto Size Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Fix Right Codes image generation so fixed node ratios always produce fixed framing, and add an `auto` ratio that preserves the returned image aspect ratio.

**Architecture:** Update the Right Codes server helper to map node ratios onto upstream-supported request sizes only. Add a client-side generated-image sizing helper so fixed ratios are center-cropped after generation while `auto` results keep their natural ratio and update the node preview accordingly.

**Tech Stack:** TypeScript, Express, React 19, browser canvas, Node test runner, `tsx`

---

### Task 1: Add failing tests for Right Codes request-size mapping

**Files:**
- Modify: `server/rightcodes.test.ts`
- Test: `server/rightcodes.test.ts`

**Step 1: Write the failing tests**

Cover:

- `3:4` maps to `1024x1536`
- `4:3` maps to `1536x1024`
- `9:16` maps to `1024x1536`
- `16:9` maps to `1536x1024`
- `auto` maps to `auto`

Keep the existing reference-image normalization assertions.

**Step 2: Run the test to verify it fails**

Run: `npx tsx --test server/rightcodes.test.ts`

Expected: FAIL because the helper still returns the old custom sizes and does not support `auto`.

### Task 2: Add failing tests for generated-image framing helpers

**Files:**
- Create: `src/components/generatedImageSizing.test.ts`
- Test: `src/components/generatedImageSizing.test.ts`
- Modify: `src/components/previewLayout.test.ts`

**Step 1: Write the failing tests**

Cover:

- a portrait image crop box for `3:4` preserves the exact target ratio
- a landscape image crop box for `16:9` preserves the exact target ratio
- `auto` fitted node sizing preserves the original image ratio
- preview height for `auto` uses actual image dimensions instead of a fixed preset

**Step 2: Run the tests to verify they fail**

Run: `npx tsx --test src/components/generatedImageSizing.test.ts src/components/previewLayout.test.ts`

Expected: FAIL because the helper module and `auto` preview support do not exist yet.

### Task 3: Implement the minimal server-side Right Codes sizing fix

**Files:**
- Modify: `server/rightcodes.ts`
- Test: `server/rightcodes.test.ts`

**Step 1: Update the ratio type and size mapping**

Add `auto` to `SupportedAspectRatio`.

Change `RIGHTCODES_SIZE_MAP` to:

- `1:1: 1024x1024`
- `3:4: 1024x1536`
- `4:3: 1536x1024`
- `9:16: 1024x1536`
- `16:9: 1536x1024`
- `auto: auto`

**Step 2: Run the helper tests**

Run: `npx tsx --test server/rightcodes.test.ts`

Expected: PASS

### Task 4: Implement the client-side generated-image framing helper

**Files:**
- Create: `src/components/generatedImageSizing.ts`
- Modify: `src/components/previewLayout.ts`
- Test: `src/components/generatedImageSizing.test.ts`
- Test: `src/components/previewLayout.test.ts`

**Step 1: Add pure helper functions**

Add helpers that:

- detect whether an aspect ratio is fixed or `auto`
- compute the center crop rectangle for a source image and fixed target ratio
- fit `auto` image dimensions for node display while preserving ratio
- compute `auto` preview height from actual node dimensions

Use `fitImportedImageDimensions` for the fitted `auto` node display size so the visual scale matches imported references.

**Step 2: Run the helper tests**

Run: `npx tsx --test src/components/generatedImageSizing.test.ts src/components/previewLayout.test.ts`

Expected: PASS

### Task 5: Wire the new sizing behavior into the canvas generation flow

**Files:**
- Modify: `src/types.ts`
- Modify: `src/components/CanvasWorkspace.tsx`
- Modify: `src/components/nodeGeneration.test.ts`

**Step 1: Extend the aspect ratio union**

Add `auto` to both node and generation-config ratio unions.

**Step 2: Update node generation post-processing**

After a Right Codes or Gemini generation result returns:

- load the generated image dimensions
- if the node ratio is fixed, crop the image to the selected ratio and keep the existing fixed node display size
- if the node ratio is `auto`, skip cropping and resize the node using the fitted actual dimensions

**Step 3: Update the ratio dropdown**

Add an `auto` option in the node controls without removing any existing fixed-ratio options.

**Step 4: Run targeted tests**

Run: `npx tsx --test src/components/generatedImageSizing.test.ts src/components/previewLayout.test.ts src/components/nodeGeneration.test.ts`

Expected: PASS

### Task 6: Verify the full change

**Files:**
- Modify: `server/rightcodes.ts`
- Modify: `server/rightcodes.test.ts`
- Create: `src/components/generatedImageSizing.ts`
- Create: `src/components/generatedImageSizing.test.ts`
- Modify: `src/components/previewLayout.ts`
- Modify: `src/components/previewLayout.test.ts`
- Modify: `src/components/CanvasWorkspace.tsx`
- Modify: `src/types.ts`
- Modify: `src/components/nodeGeneration.test.ts`

**Step 1: Run the Right Codes and sizing tests**

Run: `npx tsx --test server/rightcodes.test.ts src/components/generatedImageSizing.test.ts src/components/previewLayout.test.ts src/components/nodeGeneration.test.ts`

Expected: PASS

**Step 2: Run typecheck**

Run: `npm run lint`

Expected: PASS with no TypeScript errors.

**Step 3: Manual smoke check**

With the dev server running:

- confirm the node ratio dropdown shows `auto`
- confirm a `3:4` Right Codes generation no longer fails with `Invalid size`
- confirm `3:4` results render as fixed portrait cards
- confirm `auto` results preserve their returned ratio in the canvas card
