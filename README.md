# Layin

A desktop app for arranging photos into grid layouts for printing on a Canon Selphy CP1000.

Drag and drop photos into pre-configured grid slots, preview the layout, and export a high-resolution JPEG ready for printing.

## Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [Rust](https://www.rust-lang.org/tools/install)
- Platform-specific WebView dependencies (see [Tauri prerequisites](https://v2.tauri.app/start/prerequisites/))

## Development

```bash
npm install
npm run tauri dev
```

## Testing

Run all tests (frontend + backend):

```bash
npm test
```

Run frontend tests only:

```bash
npm run test:frontend
```

Run backend tests only:

```bash
npm run test:backend
```

## Building

```bash
npm run tauri build
```

Produces a distributable binary in `src-tauri/target/release/bundle/`.

## Usage

1. **Choose layout** — Pick a grid layout (1x1, 1x2, 2x1, 2x2)
2. **Adjust margins** — Set edge margin and gutter spacing in millimetres
3. **Drag images** — Drop image files from your file system onto individual slots
4. **Toggle fill/fit** — Hover over a filled slot and click Fill/Fit to toggle the image scaling mode
5. **Export** — Click "Export JPEG" to save a full-resolution print-ready JPEG

## Tech Stack

- **Frontend:** Svelte 5 + TypeScript + Vite
- **Backend:** Rust via Tauri v2
- **Rendering:** HTML Canvas API
- **Testing:** Vitest (frontend) + cargo test (backend)
