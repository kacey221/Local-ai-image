# AI Image Generation Canvas

AI Image Generation Canvas is a full-stack React + Express app for node-based image generation on an infinite canvas. The current build is powered by the Right Codes Draw API and is designed for workflows where you want to place references on a board, connect them to generation nodes, and iterate visually instead of working in a plain form UI.

## Key Features

- Infinite canvas with draggable image and generation nodes
- Right Codes image generation with per-node prompt, model, and aspect-ratio settings
- Reference image import by file picker, drag and drop, and clipboard paste
- Connected reference binding from prompt text with the numbered `@` reference tags shown in the UI
- Multi-reference support that combines selected references into a contact sheet for Right Codes
- Built-in generation history gallery for sending older outputs back onto the canvas
- Right Codes upscale flow for sharper follow-up outputs

## Model Options

The current canvas UI exposes the following Right Codes model options:

| Model | Description | Resolution Support |
| --- | --- | --- |
| `gpt-image-2-vip` | OpenAI's latest image model through the official upstream route. | `1K`, `2K`, `4K` |
| `gpt-image-2` | A lower-cost edition of OpenAI's latest image model. | `1K` |
| `nano-banana` | A model wrapped from `gemini-2.5-flash-image`. | Not specified in this repo |
| `nano-banana-2` | Second-generation Nano Banana model with stronger overall image quality than the previous generation. | `1K`, `2K`, `4K` |
| `nano-banana-pro` | Higher-end second-generation Nano Banana model with stronger overall image quality than the previous generation. | `1K`, `2K`, `4K` |

## Workflow

1. Start the app and open the canvas in the browser.
2. Import one or more reference images onto the board.
3. Create or select a generation node.
4. Connect references to that node and write the prompt.
5. Optionally target specific references in the prompt with the UI's numbered `@` reference tags.
6. Generate with Right Codes and continue arranging results on the canvas.
7. Upscale selected outputs when you want a cleaner final image.

## Tech Stack

- React 19
- TypeScript
- Vite
- Express
- Right Codes Draw API
- Tailwind CSS v4
- Motion
- esbuild for the production server bundle

## Getting Started

### Prerequisites

- Node.js 20+ recommended
- An API key for Right Codes Draw

### Run Locally on Your Machine

If you want to start the project on your own computer from scratch, follow these steps:

1. Clone the repository:

```bash
git clone <your-repository-url>
cd ai-image-generation-workspace
```

2. Install dependencies:

```bash
npm install
```

3. Copy the example environment file:

```bash
cp .env.example .env
```

If you are using PowerShell on Windows, you can also run:

```powershell
Copy-Item .env.example .env
```

4. Open `.env` and set your Right Codes key:

```env
RIGHTCODES_API_KEY=your_api_key_here
```

5. Start the local development server:

```bash
npm run dev
```

6. Open your browser and visit [http://localhost:3000](http://localhost:3000).

7. Confirm the app is running:

- The terminal should print a line similar to `Server running on http://0.0.0.0:3000`
- Visiting [http://localhost:3000/api/config-status](http://localhost:3000/api/config-status) should return JSON
- The canvas UI should load in the browser

The development server runs the Express backend and Vite frontend together on a single port.

### Use This Project on Another Computer

To use the project on a second machine, follow the same local setup steps above on that machine.

The additional requirements are:

- Node.js 20+ must be installed on that computer
- `RIGHTCODES_API_KEY` must be available in that computer's `.env`
- The machine must be able to reach the public Right Codes API over the internet
- Port `3000` must be free, because the current server is hard-coded to that port

If you only want to access the app from another device on the same LAN, start the project on the host machine and open:

- `http://localhost:3000` on the host machine
- `http://<host-local-ip>:3000` from another device on the same network

You may also need to allow port `3000` through the host machine's firewall.

## Environment Variables

The current build only requires `RIGHTCODES_API_KEY`.

| Variable | Required | Notes |
| --- | --- | --- |
| `RIGHTCODES_API_KEY` | Yes | Used by the active image generation and upscale routes |
| `APP_URL` | No | Deployment-oriented placeholder; not required for local development |

## Available Scripts

```bash
npm run dev
```

Starts the local full-stack development server at `http://localhost:3000`.

```bash
npm run build
```

Builds the frontend with Vite and bundles the server to `dist/server.cjs`.

```bash
npm run start
```

Runs the production bundle from `dist/`.

```bash
npm run lint
```

Runs a TypeScript type check with `tsc --noEmit`.

```bash
npm test
```

Runs the repository's `.test.ts` files through the Node test runner with `tsx`, which is required for this TypeScript + ESM setup.

## API Overview

### Active Routes

- `GET /api/config-status`
- `POST /api/rightcodes/generate-image`
- `POST /api/rightcodes/upscale-image`

### Compatibility Routes

- `POST /api/gemini/generate-image`

This route is currently an alias to the Right Codes generation handler so older frontend calls still work.

### Legacy Placeholder or Disabled Routes

- `POST /api/gemini/enhance-prompt`
- `POST /api/gemini/edit-image`
- `POST /api/gemini/upscale-image`
- `POST /api/gemini/outpaint-image`
- `POST /api/gemini/cutout-image`

`/api/gemini/enhance-prompt` currently returns the original prompt unchanged. The image edit, outpaint, cutout, and Gemini upscale routes are kept only for compatibility and return `410 Gone` in this build.

## Project Structure

```text
.
|- src/                     # React app and canvas UI
|- server/                  # Right Codes request helpers and tests
|- docs/plans/              # Design notes and implementation plans
|- server.ts                # Express server and API routes
|- .env.example             # Example environment variables
|- package.json             # Scripts and dependencies
`- dist/                    # Production build output
```

## Notes and Limitations

- This repository currently runs as a Right Codes-only build.
- Multi-reference generation is flattened into a single contact sheet image before being sent upstream.
- Prompt enhancement is a passthrough placeholder in the current server.
- Several route names still use `gemini` for backward compatibility even though generation is handled by Right Codes.
- The app does not include persistence, authentication, or collaborative multi-user editing.

## Why This README Exists

The repository started from a generic template, so this README focuses on the behavior that actually exists in the current codebase. If you continue evolving the product, the most important sections to keep updated are:

- environment variables
- active API routes
- supported generation workflows
- feature limitations
