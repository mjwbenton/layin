<script lang="ts">
  import { PAPER_SIZES } from "../lib/paper";
  import { LAYOUTS } from "../lib/layout";
  import type { PaperSize, Layout, Margins, Orientation } from "../lib/types";

  interface Props {
    paper: PaperSize;
    layout: Layout;
    margins: Margins;
    orientation: Orientation;
    onPaperChange: (paper: PaperSize) => void;
    onLayoutChange: (layout: Layout) => void;
    onMarginsChange: (margins: Margins) => void;
    onOrientationChange: (orientation: Orientation) => void;
  }

  let { paper, layout, margins, orientation, onPaperChange, onLayoutChange, onMarginsChange, onOrientationChange }: Props = $props();

  function handlePaperChange(e: Event) {
    const name = (e.target as HTMLSelectElement).value;
    const found = PAPER_SIZES.find((p) => p.name === name);
    if (found) onPaperChange(found);
  }

  function handleLayoutChange(e: Event) {
    const label = (e.target as HTMLSelectElement).value;
    const found = LAYOUTS.find((l) => l.label === label);
    if (found) onLayoutChange(found);
  }

  function handleEdgeChange(e: Event) {
    const val = parseFloat((e.target as HTMLInputElement).value);
    if (!isNaN(val) && val >= 0) {
      onMarginsChange({ ...margins, edgeMm: val });
    }
  }

  function handleGutterChange(e: Event) {
    const val = parseFloat((e.target as HTMLInputElement).value);
    if (!isNaN(val) && val >= 0) {
      onMarginsChange({ ...margins, gutterMm: val });
    }
  }
</script>

<div class="toolbar">
  <div class="toolbar-row">
    <label>
      Paper:
      <select value={paper.name} onchange={handlePaperChange}>
        {#each PAPER_SIZES as p}
          <option value={p.name}>{p.name} ({p.widthMm}x{p.heightMm}mm)</option>
        {/each}
      </select>
    </label>

    <div class="orientation-toggle">
      <span class="toggle-label">Orientation:</span>
      <button
        class="toggle-btn"
        class:active={orientation === "portrait"}
        onclick={() => onOrientationChange("portrait")}
      >Portrait</button>
      <button
        class="toggle-btn"
        class:active={orientation === "landscape"}
        onclick={() => onOrientationChange("landscape")}
      >Landscape</button>
    </div>

    <label>
      Layout:
      <select value={layout.label} onchange={handleLayoutChange}>
        {#each LAYOUTS as l}
          <option value={l.label}>{l.label}</option>
        {/each}
      </select>
    </label>

    <label>
      Edge:
      <input
        type="number"
        value={margins.edgeMm}
        min="0"
        max="20"
        step="0.5"
        onchange={handleEdgeChange}
      /> mm
    </label>

    <label>
      Gutter:
      <input
        type="number"
        value={margins.gutterMm}
        min="0"
        max="20"
        step="0.5"
        onchange={handleGutterChange}
      /> mm
    </label>
  </div>
</div>

<style>
  .toolbar {
    background: #fff;
    border-bottom: 1px solid #ddd;
    padding: 10px 16px;
    flex-shrink: 0;
  }

  .toolbar-row {
    display: flex;
    align-items: center;
    gap: 20px;
    flex-wrap: wrap;
  }

  label {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    font-weight: 500;
    color: #444;
  }

  select,
  input[type="number"] {
    padding: 5px 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 13px;
    background: #fff;
  }

  select:focus,
  input[type="number"]:focus {
    outline: none;
    border-color: #4a90d9;
    box-shadow: 0 0 0 2px rgba(74, 144, 217, 0.2);
  }

  input[type="number"] {
    width: 60px;
  }

  .orientation-toggle {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .toggle-label {
    font-size: 13px;
    font-weight: 500;
    color: #444;
    margin-right: 2px;
  }

  .toggle-btn {
    padding: 5px 10px;
    border: 1px solid #ccc;
    background: #fff;
    font-size: 13px;
    cursor: pointer;
    color: #444;
  }

  .toggle-btn:first-of-type {
    border-radius: 4px 0 0 4px;
  }

  .toggle-btn:last-of-type {
    border-radius: 0 4px 4px 0;
    border-left: none;
  }

  .toggle-btn.active {
    background: #4a90d9;
    border-color: #4a90d9;
    color: #fff;
  }

  .toggle-btn:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(74, 144, 217, 0.2);
  }
</style>
