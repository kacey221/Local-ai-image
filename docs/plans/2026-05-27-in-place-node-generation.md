# In-Place Node Generation Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Update node-based generation so the generated result appears inside the current prompt card instead of creating a new card.

**Architecture:** Add a tiny helper for node-generation success updates, then swap the current child-node creation path in `CanvasWorkspace` for an `onUpdateLayer` call that writes the generated image back into the active node.

**Tech Stack:** React 19, TypeScript, Node test runner, `tsx`

---

### Task 1: Add a failing test for in-place node generation updates

**Files:**
- Create: `src/components/nodeGeneration.test.ts`
- Test: `src/components/nodeGeneration.test.ts`

**Step 1: Write the failing test**

Verify:

- the returned node keeps the same id
- `src` changes to the generated image
- width and height change to the selected ratio dimensions
- prompt and parent relationships remain unchanged

**Step 2: Run test to verify it fails**

Run: `npx tsx --test src/components/nodeGeneration.test.ts`

Expected: FAIL because the helper module does not exist yet.

### Task 2: Implement the minimal node-generation helper

**Files:**
- Create: `src/components/nodeGeneration.ts`
- Test: `src/components/nodeGeneration.test.ts`

**Step 1: Write minimal implementation**

Return a copy of the current node with:

- updated `src`
- updated `width`
- updated `height`

Keep the rest of the node unchanged.

**Step 2: Run test to verify it passes**

Run: `npx tsx --test src/components/nodeGeneration.test.ts`

Expected: PASS

### Task 3: Replace child-node creation in CanvasWorkspace

**Files:**
- Modify: `src/components/CanvasWorkspace.tsx`
- Modify: `src/components/nodeGeneration.ts`

**Step 1: Update the node generation success branch**

Replace the current `childNode` creation logic in `handleLocalNodeGenerateSubmit` with an `onUpdateLayer` call using the helper.

**Step 2: Preserve current selection and connections**

Do not create or select a new node.

### Task 4: Verify the change

**Files:**
- Modify: `src/components/CanvasWorkspace.tsx`
- Modify: `src/components/nodeGeneration.ts`
- Modify: `src/components/nodeGeneration.test.ts`

**Step 1: Run targeted tests**

Run: `npx tsx --test src/components/nodeGeneration.test.ts`

Expected: PASS

**Step 2: Run existing focused tests**

Run:
- `npx tsx --test src/components/imageImport.test.ts`
- `npx tsx --test src/components/previewLayout.test.ts`
- `npx tsx --test server/rightcodes.test.ts`

Expected: PASS

**Step 3: Run typecheck**

Run: `npm run lint`

Expected: PASS with no TypeScript errors.
