# Right Codes Image Generation Integration Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add Right Codes Draw image generation as a separate backend route and a new generation-node engine option.

**Architecture:** Create a small server helper module for all Right Codes request/response shaping, then wire it into a dedicated Express route. Update generation node UI and request logic so the new engine routes only node-based generation traffic to the Right Codes backend.

**Tech Stack:** TypeScript, Express, React 19, Node test runner, `tsx`

---

### Task 1: Add failing helper tests for Right Codes request shaping

**Files:**
- Create: `server/rightcodes.test.ts`
- Test: `server/rightcodes.test.ts`

**Step 1: Write the failing test**

Cover:

- `1:1` maps to `1024x1024`
- `9:16` maps to `1024x1820`
- negative prompt is merged into the outgoing prompt
- data URL references are stripped to raw base64
- remote URL references remain unchanged
- image bytes are converted into a `data:image/...;base64,...` string

**Step 2: Run test to verify it fails**

Run: `npx tsx --test server/rightcodes.test.ts`

Expected: FAIL because the helper module does not exist yet.

### Task 2: Implement the minimal Right Codes helper module

**Files:**
- Create: `server/rightcodes.ts`
- Test: `server/rightcodes.test.ts`

**Step 1: Write minimal implementation**

Add:

- `mapAspectRatioToRightCodesSize`
- `buildRightCodesImageRequest`
- `bufferToDataUrl`

Use a fixed default model of `gpt-image-2`.

**Step 2: Run helper tests**

Run: `npx tsx --test server/rightcodes.test.ts`

Expected: PASS

### Task 3: Add the Right Codes backend route

**Files:**
- Modify: `server.ts`
- Modify: `.env.example`
- Modify: `server/rightcodes.ts`

**Step 1: Add environment handling**

- Read `RIGHTCODES_API_KEY`
- Extend `/api/config-status` with `hasRightCodesKey`
- Keep existing `hasKey` intact for compatibility

**Step 2: Add `/api/rightcodes/generate-image`**

The route should:

- validate `prompt`
- build the request body with the helper
- call `https://www.right.codes/draw/v1/images/generations`
- fetch returned URLs
- convert them to data URLs
- return `{ success: true, images }`

**Step 3: Run helper tests again**

Run: `npx tsx --test server/rightcodes.test.ts`

Expected: PASS

### Task 4: Wire the new engine into node generation

**Files:**
- Modify: `src/types.ts`
- Modify: `src/components/CanvasWorkspace.tsx`

**Step 1: Extend the engine union**

Add `rightcodes-image` to the node and generation config engine types.

**Step 2: Update node generation routing**

- Add the `Right Codes` engine option to the node dropdown
- When selected, send node generation requests to `/api/rightcodes/generate-image`
- Pass the first connected reference image as `referenceImage`

**Step 3: Keep existing behavior for other engines**

Gemini and Imagen engines continue using `/api/gemini/generate-image`.

### Task 5: Verify the full change

**Files:**
- Modify: `server.ts`
- Modify: `server/rightcodes.ts`
- Modify: `server/rightcodes.test.ts`
- Modify: `src/types.ts`
- Modify: `src/components/CanvasWorkspace.tsx`
- Modify: `.env.example`

**Step 1: Run targeted tests**

Run: `npx tsx --test server/rightcodes.test.ts`

Expected: PASS

**Step 2: Run typecheck**

Run: `npm run lint`

Expected: PASS with no TypeScript errors.

**Step 3: Manual smoke check**

With the dev server running:

- confirm `Right Codes` appears in the node engine dropdown
- confirm selecting it sends requests to the new route
- confirm generated images still appear as canvas nodes
