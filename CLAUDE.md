# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build and Development Commands

| Command | Purpose |
|---------|---------|
| `npm run tauri dev` | Start dev server + Tauri desktop window |
| `npm test` | Run all tests (frontend + backend) |
| `npm run test:frontend` | Frontend tests only (Vitest) |
| `npm run test:backend` | Backend tests only (cargo test) |
| `npm run test:watch` | Frontend tests in watch mode |
| `npm run check` | Type-check with svelte-check |
| `npm run tauri build` | Build distributable binary |

Prerequisites: Node.js, Rust toolchain, Tauri v2 CLI (`cargo install tauri-cli --version "^2"`).

## Architecture

Layin is a Tauri v2 desktop app for arranging photos into grid layouts for printing on a Canon Selphy CP1000. Frontend is Svelte 5 + TypeScript; backend is Rust.

### Frontend (`src/`)

- **`App.svelte`** — Root component. Owns all application state using Svelte 5 runes (`$state`, `$effect`). Passes data down and receives callbacks up.
- **`components/`** — `Toolbar.svelte` (paper/layout/margin controls), `Preview.svelte` (canvas-based layout preview with ResizeObserver scaling), `Slot.svelte` (drag-and-drop image slots with fill/fit toggle), `ExportButton.svelte`.
- **`lib/types.ts`** — Shared TypeScript interfaces (`PaperSize`, `Layout`, `Margins`, `SlotImage`, `Slot`, `FitMode`).
- **`lib/paper.ts`** — Paper size definitions and mm-to-px conversion at 300 DPI.
- **`lib/layout.ts`** — `calculateSlots()` computes pixel positions for image slots given paper size, grid layout, and margins.
- **`lib/canvas-renderer.ts`** — `renderLayout()` draws images onto canvas. `calculateImageDrawRect()` handles fill (center-crop) vs fit (letterbox) modes.
- **`lib/export.ts`** — `exportJpeg()` orchestrates export: offscreen canvas render → JPEG blob (95% quality) → native save dialog → Tauri `save_image` command.

### Backend (`src-tauri/src/`)

- **`lib.rs`** — Tauri app builder setup, registers plugins and commands.
- **`commands.rs`** — Single IPC command: `save_image(path, data)` writes binary image data to disk.

### Frontend↔Backend IPC

The only Tauri command is `save_image`. Frontend calls `invoke("save_image", { path, data })` from `@tauri-apps/api/core`. The native file save dialog comes from `@tauri-apps/plugin-dialog`.

## Testing

Frontend tests live in `src/tests/` and use Vitest with jsdom. Backend tests are inline in `src-tauri/src/commands.rs` using Rust's `#[test]`. Run a single frontend test file with `npx vitest run src/tests/paper.test.ts`.

## Key Conventions

- All rendering math uses 300 DPI (print resolution). `mmToPx()` in `paper.ts` is the conversion function.
- No ESLint/Prettier configured. Type safety enforced via TypeScript strict mode and `svelte-check`.
- Svelte 5 runes pattern — state lives in `App.svelte`, no external state management library.
