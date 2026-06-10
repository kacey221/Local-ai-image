# Pink Lilac Theme Refresh Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Make the prompt-card lower section white and replace the main purple/blue accents with a soft pink-lilac gradient palette.

**Architecture:** Add a tiny shared theme-token module with the new gradient and prompt-surface classes, verify those tokens with a focused test, then apply them to the relevant UI sections in `App.tsx` and `CanvasWorkspace.tsx`.

**Tech Stack:** React 19, TypeScript, Node test runner, `tsx`

---

### Task 1: Add a failing test for the new theme tokens

**Files:**
- Create: `src/uiTheme.test.ts`
- Test: `src/uiTheme.test.ts`

**Step 1: Write the failing test**

Verify:

- the accent gradient includes rose, fuchsia, and violet classes
- the prompt-card surface token includes a white background

**Step 2: Run test to verify it fails**

Run: `npx tsx --test src/uiTheme.test.ts`

Expected: FAIL because the token module does not exist yet.

### Task 2: Implement the theme token module

**Files:**
- Create: `src/uiTheme.ts`
- Test: `src/uiTheme.test.ts`

**Step 1: Write minimal implementation**

Add tokens for:

- soft pink-lilac gradients
- white prompt-card surface styling

**Step 2: Run test to verify it passes**

Run: `npx tsx --test src/uiTheme.test.ts`

Expected: PASS

### Task 3: Apply the accent refresh

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/components/CanvasWorkspace.tsx`
- Modify: `src/uiTheme.ts`

**Step 1: Update the upper accent areas**

- logo gradient
- membership button
- highlighted tabs and top action buttons
- selected tool states

**Step 2: Update the prompt-card lower section**

- prompt-card lower surface
- nested control buttons
- dropdowns, textarea, borders, and hover states

### Task 4: Verify the change

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/components/CanvasWorkspace.tsx`
- Modify: `src/uiTheme.ts`
- Modify: `src/uiTheme.test.ts`

**Step 1: Run the theme-token test**

Run: `npx tsx --test src/uiTheme.test.ts`

Expected: PASS

**Step 2: Run typecheck**

Run: `npm run lint`

Expected: PASS with no TypeScript errors.
