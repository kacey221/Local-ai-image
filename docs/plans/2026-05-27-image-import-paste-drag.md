# Image Import Paste and Drag Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add screenshot paste, image drag-and-drop, and ratio-preserving reference-image imports to the canvas.

**Architecture:** Introduce a small image-fitting helper that can be tested in isolation, then build a unified image import pipeline in `CanvasWorkspace` that all three import entry points use. Update reference-node rendering to use the imported node dimensions and display the full image.

**Tech Stack:** React 19, TypeScript, browser FileReader/Image APIs, Node test runner, `tsx`

---

### Task 1: Add a failing test for imported image size fitting

**Files:**
- Create: `src/components/imageImport.test.ts`
- Test: `src/components/imageImport.test.ts`

**Step 1: Write the failing test**

Verify:

- large landscape images scale down proportionally
- large portrait images scale down proportionally
- small images keep their original size
- invalid dimensions fall back to a safe default

**Step 2: Run test to verify it fails**

Run: `npx tsx --test src/components/imageImport.test.ts`

Expected: FAIL because the helper module does not exist yet.

### Task 2: Implement the image fitting helper

**Files:**
- Create: `src/components/imageImport.ts`
- Test: `src/components/imageImport.test.ts`

**Step 1: Write minimal implementation**

Add a helper that fits imported image dimensions within a max long edge while preserving aspect ratio.

**Step 2: Run test to verify it passes**

Run: `npx tsx --test src/components/imageImport.test.ts`

Expected: PASS

### Task 3: Build the unified import pipeline in CanvasWorkspace

**Files:**
- Modify: `src/components/CanvasWorkspace.tsx`
- Modify: `src/components/imageImport.ts`

**Step 1: Replace fixed upload sizing**

Update file-picker upload to:

- read the image source
- load the natural dimensions
- create a fitted reference node

**Step 2: Add clipboard paste support**

- listen for image clipboard items
- create new reference nodes from pasted screenshots
- ignore text-entry focus targets

**Step 3: Add drag-and-drop support**

- handle dragover and drop on the main canvas viewport
- import all dropped image files

### Task 4: Make imported reference images display fully

**Files:**
- Modify: `src/components/CanvasWorkspace.tsx`

**Step 1: Use imported node dimensions in reference cards**

- make the reference preview height track `node.height`
- render the reference image with `object-contain`

**Step 2: Keep connection visuals reasonable**

- update reference-node cable anchor calculations to use the actual reference-node height instead of the old fixed `240`

### Task 5: Verify the change

**Files:**
- Modify: `src/components/CanvasWorkspace.tsx`
- Modify: `src/components/imageImport.ts`
- Modify: `src/components/imageImport.test.ts`

**Step 1: Run helper test**

Run: `npx tsx --test src/components/imageImport.test.ts`

Expected: PASS

**Step 2: Run existing targeted tests**

Run: `npx tsx --test src/components/previewLayout.test.ts`

Expected: PASS

**Step 3: Run typecheck**

Run: `npm run lint`

Expected: PASS with no TypeScript errors.
