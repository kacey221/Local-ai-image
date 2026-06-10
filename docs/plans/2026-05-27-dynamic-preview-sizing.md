# Dynamic Preview Sizing Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Make the generation card preview area resize with the selected aspect ratio and show the image fully within the preview frame.

**Architecture:** Extract preview height calculation into a tiny helper module so the ratio logic can be tested in isolation. Update the selected and unselected generation card preview containers, plus the crop overlay, to use that helper instead of the current fixed `220px` height.

**Tech Stack:** React 19, TypeScript, Node test runner, `tsx`

---

### Task 1: Add a failing test for preview height calculation

**Files:**
- Create: `src/components/previewLayout.test.ts`
- Test: `src/components/previewLayout.test.ts`

**Step 1: Write the failing test**

Verify:

- square ratio stays square
- `3:4` preview is taller than square
- selected card preview subtracts horizontal padding
- `16:9` preview is shorter than square

**Step 2: Run test to verify it fails**

Run: `npx tsx --test src/components/previewLayout.test.ts`

Expected: FAIL because the helper module does not exist yet.

### Task 2: Implement the preview layout helper

**Files:**
- Create: `src/components/previewLayout.ts`
- Test: `src/components/previewLayout.test.ts`

**Step 1: Write minimal implementation**

Add:

- supported ratio dimensions
- preview height calculation for selected and unselected cards

**Step 2: Run test to verify it passes**

Run: `npx tsx --test src/components/previewLayout.test.ts`

Expected: PASS

### Task 3: Wire the helper into generation card previews

**Files:**
- Modify: `src/components/CanvasWorkspace.tsx`

**Step 1: Replace fixed preview heights**

Update:

- selected generation preview
- unselected generation preview
- selected crop overlay height

**Step 2: Show the full image**

Change the generation card preview image fit from `object-cover` to `object-contain`.

### Task 4: Verify the change

**Files:**
- Modify: `src/components/CanvasWorkspace.tsx`
- Modify: `src/components/previewLayout.ts`
- Modify: `src/components/previewLayout.test.ts`

**Step 1: Run helper test**

Run: `npx tsx --test src/components/previewLayout.test.ts`

Expected: PASS

**Step 2: Run typecheck**

Run: `npm run lint`

Expected: PASS with no TypeScript errors.
