# README Refresh Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the placeholder repository README with accurate GitHub-facing documentation for the current Right Codes-based image canvas app.

**Architecture:** Keep the documentation change local to markdown files. Use the current frontend, server routes, tests, and environment example as the source of truth so the README reflects the real app rather than an older Gemini-focused template.

**Tech Stack:** Markdown, TypeScript source inspection, React 19, Express, Vite, Right Codes Draw API

---

### Task 1: Capture the current product and runtime behavior

**Files:**
- Modify: `README.md`
- Reference: `server.ts`
- Reference: `src/components/CanvasWorkspace.tsx`
- Reference: `src/components/referenceRequest.ts`
- Reference: `.env.example`

**Step 1: Review the active backend routes**

Confirm:

- the active generation route is `POST /api/rightcodes/generate-image`
- `POST /api/rightcodes/upscale-image` is active
- `POST /api/gemini/generate-image` is a compatibility alias
- prompt enhancement is a no-op
- legacy image edit routes return `410 Gone`

**Step 2: Review the current canvas workflow**

Confirm:

- the app supports reference imports
- generation runs from canvas nodes
- connected references can be bound in prompt text
- multiple references are composed into a contact sheet

### Task 2: Draft the new README structure

**Files:**
- Modify: `README.md`
- Create: `docs/plans/2026-06-10-readme-refresh-design.md`

**Step 1: Replace the template framing**

Remove:

- AI Studio template wording
- Gemini-first setup language
- generic banner content

**Step 2: Add the approved hybrid structure**

Write sections for:

- overview
- feature highlights
- workflow
- tech stack
- getting started
- environment variables
- scripts
- API overview
- project structure
- limitations

### Task 3: Add accurate setup guidance

**Files:**
- Modify: `README.md`
- Reference: `package.json`
- Reference: `.env.example`

**Step 1: Document local installation**

Include:

- Node.js prerequisite
- dependency install command
- `.env` setup
- local dev URL

**Step 2: Document runtime variables and scripts**

Include:

- `RIGHTCODES_API_KEY` as required
- `APP_URL` as optional or deployment-oriented
- `dev`, `build`, `start`, and `lint` scripts

### Task 4: Document compatibility and limitations

**Files:**
- Modify: `README.md`
- Reference: `server.ts`

**Step 1: Add API notes**

Explain:

- active Right Codes routes
- compatibility alias route
- disabled legacy Gemini edit routes

**Step 2: Add product limitations**

Explain:

- current build is Right Codes-only
- multi-reference requests are flattened into a contact sheet
- prompt enhancement is currently a passthrough

### Task 5: Verify the documentation

**Files:**
- Modify: `README.md`
- Create: `docs/plans/2026-06-10-readme-refresh.md`

**Step 1: Re-read the final README for consistency**

Check:

- commands match `package.json`
- environment variables match `.env.example` and `server.ts`
- feature claims match the current code

**Step 2: Save the final markdown files**

Deliver:

- updated `README.md`
- design note
- implementation plan
