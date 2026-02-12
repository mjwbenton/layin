# Layin - Implementation Plan

## Context

Building a Tauri v2 desktop app from scratch for arranging photos into grid layouts for printing on a Canon Selphy CP1000. The repo currently contains only `REQUIREMENTS.md` — no code exists yet. The plan covers scaffolding through to a complete, tested, documented application.

**Commit policy:** Commit after every meaningful step (each step below = one commit).

---

## Architecture

- **Backend:** Rust via Tauri v2 — one custom command (`save_image`) + dialog plugin
- **Frontend:** Svelte 5 + TypeScript + Vite (plain Svelte, not SvelteKit)
- **Rendering:** HTML Canvas API for both live preview and full-resolution export
- **Styling:** Plain CSS
- **Testing:** Vitest (frontend), cargo test (backend)
- **State:** Svelte 5 runes (`$state`, `$derived`, `$effect`) — no external state library

Core layout calculations live in pure TypeScript functions (no DOM dependency), making them straightforward to unit test. The canvas renderer is shared between preview (scaled down) and export (full 300 DPI).

---

## Project Structure (Final)

```
layin/
  REQUIREMENTS.md
  README.md
  package.json
  vite.config.ts
  tsconfig.json
  svelte.config.js
  index.html
  src/
    main.ts
    App.svelte
    lib/
      types.ts              # TypeScript interfaces
      paper.ts              # Paper size definitions + mmToPx
      layout.ts             # Pure slot calculation functions
      canvas-renderer.ts    # Canvas drawing (preview + export)
      export.ts             # Export orchestration (dialog + save)
    components/
      Toolbar.svelte
      Preview.svelte
      Slot.svelte
      ExportButton.svelte
    styles/
      global.css
  src/tests/
    layout.test.ts
    paper.test.ts
    canvas-renderer.test.ts
  src-tauri/
    Cargo.toml
    src/
      main.rs
      lib.rs
      commands.rs           # save_image command + tests
    capabilities/
      default.json
```

---

## Steps

### Step 1: Scaffold Tauri v2 + Svelte 5 project
Scaffold with `npm create tauri-app@latest` (Svelte + TypeScript), move files into repo root alongside existing `REQUIREMENTS.md`. Add `.gitignore`. Run `npm install` and verify `npm run tauri dev` opens a window.

**Key files:** `package.json`, `vite.config.ts`, `svelte.config.js`, `tsconfig.json`, `index.html`, `src/main.ts`, `src/App.svelte`, `src-tauri/*`
**Commit:** `Scaffold Tauri v2 app with Svelte 5 and TypeScript`

### Step 2: Set up Vitest testing infrastructure
Install `vitest` and `jsdom`. Configure Vitest in `vite.config.ts`. Add `test` scripts to `package.json`. Add a trivial passing test. Run `npm test`.

**Key files:** `vite.config.ts`, `package.json`, `src/tests/setup.test.ts`
**Commit:** `Set up Vitest testing infrastructure`

### Step 3: Paper sizes, types, and layout calculation + tests
Create the core data model (`types.ts`, `paper.ts`) and pure layout calculation functions (`layout.ts`). Write comprehensive unit tests covering: slot counts for all layouts, boundary checking, equal slot dimensions, zero-margin edge cases, mm-to-px conversion.

**Key files:** `src/lib/types.ts`, `src/lib/paper.ts`, `src/lib/layout.ts`, `src/tests/paper.test.ts`, `src/tests/layout.test.ts`
**Commit:** `Add paper sizes, layout calculation logic, and unit tests`

### Step 4: Basic UI shell — toolbar, preview placeholder, export button
Build the single-window layout: toolbar at top (paper size dropdown, layout picker, margin inputs), preview area in center (placeholder div with correct aspect ratio and slot outlines), export button at bottom. Wire up app state with Svelte 5 runes.

**Key files:** `src/App.svelte`, `src/components/Toolbar.svelte`, `src/components/Preview.svelte`, `src/components/ExportButton.svelte`, `src/styles/global.css`, `src/main.ts`
**Commit:** `Build main UI shell with toolbar, preview area, and export button`

### Step 5: Canvas-based preview rendering + tests
Replace placeholder preview with a real `<canvas>`. Create shared `canvas-renderer.ts` with `renderLayout()` function and `calculateImageDrawRect()` (pure, testable). Extract fill/fit calculation as pure functions. Write tests for image draw rect calculations (landscape/portrait images, fill vs fit modes).

**Key files:** `src/lib/canvas-renderer.ts`, `src/components/Preview.svelte`, `src/tests/canvas-renderer.test.ts`
**Commit:** `Implement canvas-based preview rendering with fill/fit calculations`

### Step 6: Drag and drop image loading
Create `Slot.svelte` as transparent overlay drop targets on top of the canvas. Handle dragover/drop events, load images via `URL.createObjectURL`, render immediately on canvas. Add per-slot clear (X) and fit mode toggle buttons.

**Key files:** `src/components/Slot.svelte`, `src/components/Preview.svelte`, `src/App.svelte`
**Commit:** `Add drag-and-drop image loading with per-slot fit mode toggle`

### Step 7: JPEG export with native save dialog
Add `tauri-plugin-dialog` (Rust + npm). Create Rust `save_image` command. Create `export.ts`: render offscreen canvas at full 300 DPI, convert to JPEG blob (95% quality), show native save dialog, invoke Rust command to write file. Default filename: `layin-{date}-{time}.jpg`.

**Key files:** `src-tauri/src/commands.rs`, `src-tauri/src/lib.rs`, `src-tauri/capabilities/default.json`, `src/lib/export.ts`, `src/components/ExportButton.svelte`
**Commit:** `Implement JPEG export with native save dialog and Rust file writing`

### Step 8: Rust-side tests
Add unit tests for `save_image`: file creation, parent directory creation, correct binary content. Add `tokio` as dev dependency for async tests. Add combined test script to `package.json` (`npm test` runs both Vitest + cargo test).

**Key files:** `src-tauri/src/commands.rs`, `src-tauri/Cargo.toml`, `package.json`
**Commit:** `Add Rust unit tests for save_image command`

### Step 9: UI polish
Improve styling: proper toolbar alignment, drag-over visual feedback (dashed border highlight), slot placeholder text, responsive preview scaling with ResizeObserver, clean button styles.

**Key files:** `src/styles/global.css`, `src/components/Toolbar.svelte`, `src/components/Slot.svelte`, `src/components/Preview.svelte`
**Commit:** `Polish UI styling and drag-drop visual feedback`

### Step 10: README with usage instructions
Write `README.md` covering:
- What is Layin
- Prerequisites (Rust, Node.js, platform WebView deps)
- Development: `npm install && npm run tauri dev`
- Testing: `npm test` / `npm run test:frontend` / `npm run test:backend`
- Building: `npm run tauri build`
- Usage walkthrough (select paper, choose layout, adjust margins, drag images, toggle fill/fit, export)
- Supported paper sizes table

Run all tests one final time to confirm everything passes.

**Key files:** `README.md`
**Commit:** `Add README with build, test, and usage instructions`

---

## Testing Strategy

### Frontend (Vitest)
| Test file | What it covers |
|-----------|---------------|
| `paper.test.ts` | `mmToPx` conversion, paper size constants |
| `layout.test.ts` | `calculateSlots` — slot counts, bounds, equal sizing, edge cases |
| `canvas-renderer.test.ts` | `calculateImageDrawRect` — fill vs fit for various aspect ratios |

### Backend (cargo test)
| Location | What it covers |
|----------|---------------|
| `commands.rs` | `save_image` — file creation, parent dirs, binary content |

### Manual testing
- Svelte components, canvas visual output, drag-and-drop UX, Tauri dialog integration — tested by running the app during development

---

## Verification

After all steps complete:
1. `npm test` — all frontend + backend tests pass
2. `npm run tauri dev` — app opens, all controls work, drag-drop loads images, preview updates live
3. Export a JPEG — file dialog opens, file saves, output is correct resolution (1181x1748 for Postcard) at 300 DPI
4. `npm run tauri build` — produces a distributable binary
