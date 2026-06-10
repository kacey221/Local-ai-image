# Connected Reference Visibility Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Make the selected image-generation card show only its connected reference images in the thumbnail strip and `@参考图` mention dropdown.

**Architecture:** Extract the reference-filtering and stable-labeling logic into a tiny helper module so the behavior can be tested in isolation. Update `CanvasWorkspace.tsx` to consume that helper in both UI surfaces, keeping existing card state and connection fields unchanged.

**Tech Stack:** React 19, TypeScript, Vite, `tsx`, Node test runner

---

### Task 1: Add a focused failing test for connected reference filtering

**Files:**
- Create: `src/components/referenceConnections.test.ts`
- Test: `src/components/referenceConnections.test.ts`

**Step 1: Write the failing test**

Write tests that expect:

- Only connected reference nodes are returned
- Returned items keep their original canvas-based reference numbers
- `parentId` and `parentIds` are both respected

**Step 2: Run test to verify it fails**

Run: `npx tsx --test src/components/referenceConnections.test.ts`

Expected: FAIL because the helper module does not exist yet.

### Task 2: Implement the minimal helper to satisfy the test

**Files:**
- Create: `src/components/referenceConnections.ts`
- Test: `src/components/referenceConnections.test.ts`

**Step 1: Write minimal implementation**

Add a helper that:

- Accepts all layers and the current generation node
- Finds reference layers in canvas order
- Filters to the connected subset
- Returns each connected reference with its stable display number

**Step 2: Run test to verify it passes**

Run: `npx tsx --test src/components/referenceConnections.test.ts`

Expected: PASS

### Task 3: Wire the helper into the selected card UI

**Files:**
- Modify: `src/components/CanvasWorkspace.tsx`
- Modify: `src/components/referenceConnections.ts`

**Step 1: Replace direct all-reference rendering**

Use the connected-reference helper result for:

- The top thumbnail strip
- The `@参考图` dropdown list

Keep prompt insertion using the helper's stable label number.

**Step 2: Preserve empty states**

When there are no connected references:

- Render no reference thumbnails
- Keep the dropdown empty-state message

**Step 3: Run the focused test**

Run: `npx tsx --test src/components/referenceConnections.test.ts`

Expected: PASS

### Task 4: Verify the project still typechecks

**Files:**
- Modify: `src/components/CanvasWorkspace.tsx`
- Modify: `src/components/referenceConnections.ts`
- Test: `src/components/referenceConnections.test.ts`

**Step 1: Run full verification**

Run: `npm run lint`

Expected: PASS with no TypeScript errors.

**Step 2: Optional manual behavior check**

With the dev server running, confirm:

- A generation card with no connected references shows no `参考图1/2` entries
- Connecting a reference makes that reference appear in both UI surfaces
- Mention insertion still produces the correct stable `@参考图X` text
