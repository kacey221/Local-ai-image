# README Refresh Design

**Date:** 2026-06-10

**Goal:** Replace the stock template README with a GitHub-ready English README that helps both first-time visitors and developers who want to run the project locally.

## Problem

The current `README.md` is still a generic AI Studio template. It does not explain the actual product, does not describe the current Right Codes-based backend, and does not give accurate setup guidance for this repository's present state.

## Approved Scope

- Write the README in English
- Use a hybrid structure that balances product overview and developer onboarding
- Describe the real feature set exposed by the current codebase
- Document local setup, required environment variables, and available npm scripts
- Summarize active API routes and compatibility routes
- Call out the current Right Codes-only limitations clearly

## Out of Scope

- Adding screenshots or badges
- Writing a deployment guide for a specific hosting platform
- Changing runtime behavior or package scripts
- Renaming files or restructuring the repository

## Approach

The README should open with a short product explanation so a GitHub visitor can understand the project quickly. After that, it should shift into practical developer documentation: prerequisites, environment variables, local startup, scripts, API shape, and repository structure.

Because the server now routes image generation through Right Codes and keeps some legacy Gemini route names only for compatibility, the README should explain that distinction explicitly. This avoids misleading users into expecting Gemini editing, outpainting, or prompt-enhancement features that are not active in the current build.

## Proposed Sections

- Title and one-paragraph overview
- Feature highlights
- How the canvas workflow works
- Tech stack
- Getting started
- Environment variables
- Available scripts
- API overview
- Project structure
- Notes and current limitations

## Edge Cases

- Clarify that `RIGHTCODES_API_KEY` is the only required variable in the current build
- Note that `POST /api/gemini/generate-image` is a compatibility alias
- Note that several legacy Gemini edit routes return `410 Gone`
- Explain multi-reference behavior as a composed contact sheet for Right Codes
