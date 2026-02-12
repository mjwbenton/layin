<script lang="ts">
  import "./styles/global.css";
  import Toolbar from "./components/Toolbar.svelte";
  import Preview from "./components/Preview.svelte";
  import ExportButton from "./components/ExportButton.svelte";
  import { DEFAULT_PAPER } from "./lib/paper";
  import { DEFAULT_LAYOUT, DEFAULT_MARGINS } from "./lib/layout";
  import { exportJpeg } from "./lib/export";
  import type { PaperSize, Layout, Margins, SlotImage } from "./lib/types";

  let paper: PaperSize = $state(DEFAULT_PAPER);
  let layout: Layout = $state(DEFAULT_LAYOUT);
  let margins: Margins = $state(DEFAULT_MARGINS);
  let images: (SlotImage | null)[] = $state([]);

  $effect(() => {
    const count = layout.rows * layout.cols;
    images = Array.from({ length: count }, () => null);
  });

  function handleSlotDrop(index: number, image: SlotImage) {
    // Revoke old URL if replacing
    if (images[index]) {
      URL.revokeObjectURL(images[index].url);
    }
    images[index] = image;
  }

  function handleSlotClear(index: number) {
    if (images[index]) {
      URL.revokeObjectURL(images[index].url);
      images[index] = null;
    }
  }

  function handleSlotToggleFit(index: number) {
    const img = images[index];
    if (img) {
      images[index] = {
        ...img,
        fitMode: img.fitMode === "fill" ? "fit" : "fill",
      };
    }
  }

  async function handleExport() {
    await exportJpeg(paper, layout, margins, images);
  }
</script>

<Toolbar
  {paper}
  {layout}
  {margins}
  onPaperChange={(p) => (paper = p)}
  onLayoutChange={(l) => (layout = l)}
  onMarginsChange={(m) => (margins = m)}
/>

<Preview
  {paper}
  {layout}
  {margins}
  {images}
  onSlotDrop={handleSlotDrop}
  onSlotClear={handleSlotClear}
  onSlotToggleFit={handleSlotToggleFit}
/>

<ExportButton onexport={handleExport} />
