<script lang="ts">
  import "./styles/global.css";
  import Toolbar from "./components/Toolbar.svelte";
  import Preview from "./components/Preview.svelte";
  import ExportButton from "./components/ExportButton.svelte";
  import { DEFAULT_PAPER } from "./lib/paper";
  import { DEFAULT_LAYOUT, DEFAULT_MARGINS } from "./lib/layout";
  import type { PaperSize, Layout, Margins, SlotImage } from "./lib/types";

  let paper: PaperSize = $state(DEFAULT_PAPER);
  let layout: Layout = $state(DEFAULT_LAYOUT);
  let margins: Margins = $state(DEFAULT_MARGINS);
  let images: (SlotImage | null)[] = $state([]);

  // Reset images when layout changes (slot count may change)
  $effect(() => {
    const count = layout.rows * layout.cols;
    images = Array.from({ length: count }, () => null);
  });

  function handleExport() {
    // TODO: implement in Step 7
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

<Preview {paper} {layout} {margins} {images} />

<ExportButton onexport={handleExport} />
