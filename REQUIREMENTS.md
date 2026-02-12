# Layin - Photo Layout for Printing

A desktop app for arranging photos into grid layouts ready for printing on a Canon Selphy CP1000.

## Overview

Drag and drop photos into pre-configured grid slots, preview the layout, and export a high-resolution JPEG ready for printing.

## Supported Paper Sizes

Target printer: Canon Selphy CP1000 (300 DPI)

| Name     | Dimensions (mm) | Dimensions (px at 300 DPI) |
|----------|-----------------|---------------------------|
| Postcard | 100 x 148       | 1181 x 1748              |
| L Size   | 89 x 119        | 1051 x 1406              |
| Card     | 54 x 86         | 638 x 1016               |

The default paper size should be Postcard (100 x 148mm), as this is the most common Selphy media.

## Layout System

Layouts are simple grids defined by rows and columns. All image slots within a layout are the same size.

Initial layouts to support:
- **1x1** — single full-page image
- **1x2** — two images side by side (landscape orientation)
- **2x1** — two images stacked (portrait orientation)
- **2x2** — four images in a grid

The user selects a layout from a simple picker (e.g. visual thumbnails or a dropdown).

## Margins

The user can configure:
- **Edge margin** — space between the images and the edge of the page (all four sides equal)
- **Gutter** — space between adjacent images (horizontal and vertical equal)

Margins are specified in millimetres. Sensible defaults: 2mm edge, 2mm gutter.

Image slot sizes are calculated as the remaining space after margins are subtracted, divided equally among the grid cells.

## Image Handling

### Drag and Drop
- Users drag image files from their file system onto individual slots in the layout preview
- Each slot shows a placeholder when empty and a preview of the dropped image when populated
- Users can clear a slot (remove the image) or replace it by dropping a new image

### Fit Mode (per-image toggle)
Each image has a fit mode, toggled per-image or set globally:
- **Fill** (default) — image is scaled and center-cropped to completely fill the slot. Some edges may be clipped.
- **Fit** — image is scaled to fit entirely within the slot, preserving aspect ratio. Empty space appears as white.

## Export

- A single "Export" button generates a JPEG at the full print resolution (300 DPI) for the selected paper size
- The background (margins, gutters, empty slots) is white
- JPEG quality: 95% (high quality for print)
- The user is prompted with a native save dialog to choose the output location and filename
- Default filename: `layin-{date}-{time}.jpg`

## Technology Stack

### Tauri v2 (Rust + Web Frontend)
- **Backend**: Rust via Tauri v2 for native file dialogs, file system access, and window management
- **Frontend**: Web technologies running in the system webview
- **Frontend framework**: Svelte (lightweight, minimal boilerplate, good fit for a small app)
- **Image compositing**: HTML Canvas API in the frontend for both preview rendering and final JPEG export
- **Styling**: Plain CSS (no framework needed for this scope)

### Why Tauri
- Native file dialogs for save/export
- Small binary size compared to Electron
- Rust backend available if we need heavier image processing later
- Good learning opportunity as requested

## UI Layout

Simple single-window app:

```
+------------------------------------------+
|  [Paper: Postcard v]  [Layout: 2x2 v]   |
|  Edge: [2mm]  Gutter: [2mm]             |
|  Fit mode: [Fill v]                      |
+------------------------------------------+
|                                          |
|   +----------+  +----------+             |
|   |          |  |          |             |
|   |  slot 1  |  |  slot 2  |             |
|   |          |  |          |             |
|   +----------+  +----------+             |
|   +----------+  +----------+             |
|   |          |  |          |             |
|   |  slot 3  |  |  slot 4  |             |
|   |          |  |          |             |
|   +----------+  +----------+             |
|                                          |
+------------------------------------------+
|              [ Export JPEG ]              |
+------------------------------------------+
```

- The preview area shows the page at a scaled-down size that fits the window, maintaining the correct aspect ratio
- The preview is a live representation — as images are dropped in, they appear immediately
- The toolbar at the top contains all configuration controls
- The export button is at the bottom

## Non-Goals (for now)

- No mixed image sizes within a layout
- No image rotation or manual repositioning within a slot
- No multi-page support
- No direct printing (export to file, print from OS)
- No undo/redo
- No project save/load
