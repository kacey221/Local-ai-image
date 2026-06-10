# Multi-Reference Binding for Gemini and Right Codes Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Make connected `@参考图N` references map to real images in generation requests, with true multi-image Gemini inputs and a numbered Right Codes contact-sheet fallback.

**Architecture:** Add a frontend helper that resolves connected references into a stable ordered selection plus a binding note. Extend both generation routes to accept multiple reference images, then let Gemini receive them as separate multimodal parts while Right Codes receives one labeled contact sheet when more than one image is selected.

**Tech Stack:** TypeScript, React 19, Express, browser canvas, Node test runner, `tsx`

---

### Task 1: Add failing tests for reference mention parsing and selection

**Files:**
- Create: `src/components/referenceBindings.test.ts`
- Test: `src/components/referenceBindings.test.ts`

**Step 1: Write the failing tests**

Cover:

- `@参考图2` selects only the second connected reference
- repeated mentions do not duplicate references
- no mentions falls back to all connected references
- unconnected mention numbers are ignored
- the generated binding note keeps UI numbering stable

**Step 2: Run the tests to verify they fail**

Run: `npx tsx --test src/components/referenceBindings.test.ts`

Expected: FAIL because the helper module does not exist yet.

### Task 2: Add failing tests for multi-reference Right Codes request shaping

**Files:**
- Modify: `server/rightcodes.test.ts`
- Test: `server/rightcodes.test.ts`

**Step 1: Write the failing tests**

Cover:

- the request helper accepts a `referenceImages` array
- one reference image stays direct
- multiple reference images trigger contact-sheet composition input handling
- the prompt includes the binding note before the user prompt

**Step 2: Run the tests to verify they fail**

Run: `npx tsx --test server/rightcodes.test.ts`

Expected: FAIL because the helper still only understands a single `referenceImage`.

### Task 3: Implement the frontend reference-binding helper

**Files:**
- Create: `src/components/referenceBindings.ts`
- Test: `src/components/referenceBindings.test.ts`

**Step 1: Write the minimal implementation**

Add helpers that:

- parse `@参考图N` mention numbers from prompt text
- select connected references by stable label number
- fall back to all connected references when no valid mentions exist
- build a short binding note string

**Step 2: Run the tests**

Run: `npx tsx --test src/components/referenceBindings.test.ts`

Expected: PASS

### Task 4: Extend the generation request pipeline to send multiple references

**Files:**
- Modify: `src/components/CanvasWorkspace.tsx`
- Modify: `src/types.ts`
- Create: `src/components/referenceRequest.ts`
- Create: `src/components/referenceRequest.test.ts`

**Step 1: Write the failing tests**

Cover:

- generation request building sends `referenceImages` in selected order
- the binding note is included
- single-reference requests still work

**Step 2: Run the tests to verify they fail**

Run: `npx tsx --test src/components/referenceRequest.test.ts`

Expected: FAIL because generation still sends only the first reference image.

**Step 3: Implement the request-building helper and wire it into the canvas**

Use the binding helper result to build the request payload for both Gemini and Right Codes node generation.

**Step 4: Run the tests**

Run: `npx tsx --test src/components/referenceBindings.test.ts src/components/referenceRequest.test.ts`

Expected: PASS

### Task 5: Extend the Gemini route for true multi-image inputs

**Files:**
- Modify: `server.ts`

**Step 1: Update request parsing**

Accept:

- `referenceImages?: string[]`
- `referenceBindingNote?: string`

**Step 2: Update Gemini request contents**

For Gemini routes:

- prepend the binding note when present
- include the main prompt text
- append every selected reference image as an image part

**Step 3: Preserve existing behavior**

When no reference images are provided, the route should behave exactly as it does today.

### Task 6: Add Right Codes multi-reference contact-sheet support

**Files:**
- Modify: `server/rightcodes.ts`
- Modify: `server/rightcodes.test.ts`
- Modify: `server.ts`

**Step 1: Extend the helper types**

Replace single-reference-only request shaping with support for:

- `referenceImages?: string[]`
- `referenceBindingNote?: string`

**Step 2: Add contact-sheet composition**

If `referenceImages.length > 1`:

- render a numbered grid image
- use stable label numbers matching the prompt mentions
- return one composed data URL to the existing Right Codes request builder

If `referenceImages.length === 1`:

- keep the existing direct-image path

**Step 3: Run the tests**

Run: `npx tsx --test server/rightcodes.test.ts`

Expected: PASS

### Task 7: Verify the full change

**Files:**
- Create: `src/components/referenceBindings.ts`
- Create: `src/components/referenceBindings.test.ts`
- Create: `src/components/referenceRequest.ts`
- Create: `src/components/referenceRequest.test.ts`
- Modify: `src/components/CanvasWorkspace.tsx`
- Modify: `src/types.ts`
- Modify: `server.ts`
- Modify: `server/rightcodes.ts`
- Modify: `server/rightcodes.test.ts`

**Step 1: Run targeted tests**

Run: `npx tsx --test src/components/referenceBindings.test.ts src/components/referenceRequest.test.ts server/rightcodes.test.ts`

Expected: PASS

**Step 2: Run typecheck**

Run: `npm run lint`

Expected: PASS with no TypeScript errors.

**Step 3: Manual smoke check**

With the dev server running:

- connect multiple references to one node
- mention `@参考图1` and `@参考图2` in the prompt
- confirm Gemini receives both images and follows the split references more reliably
- confirm Right Codes still generates with a single composed reference sheet
