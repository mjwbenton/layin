<script lang="ts">
  import { PAPER_SIZES } from "../lib/paper";
  import { LAYOUTS } from "../lib/layout";
  import type { PaperSize, Layout, Margins } from "../lib/types";

  interface Props {
    paper: PaperSize;
    layout: Layout;
    margins: Margins;
    onPaperChange: (paper: PaperSize) => void;
    onLayoutChange: (layout: Layout) => void;
    onMarginsChange: (margins: Margins) => void;
  }

  let { paper, layout, margins, onPaperChange, onLayoutChange, onMarginsChange }: Props = $props();

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
    padding: 12px 16px;
  }

  .toolbar-row {
    display: flex;
    align-items: center;
    gap: 16px;
    flex-wrap: wrap;
  }

  label {
    display: flex;
    align-items: center;
    gap: 6px;
    font-weight: 500;
  }

  select,
  input[type="number"] {
    padding: 4px 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 14px;
  }

  input[type="number"] {
    width: 64px;
  }
</style>
