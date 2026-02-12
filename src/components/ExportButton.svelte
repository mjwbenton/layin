<script lang="ts">
  interface Props {
    onexport: () => void;
  }

  let { onexport }: Props = $props();
</script>

<div class="export-bar">
  <button class="export-btn" onclick={onexport}>Export JPEG</button>
</div>

<style>
  .export-bar {
    background: #fff;
    border-top: 1px solid #ddd;
    padding: 12px 16px;
    display: flex;
    justify-content: center;
  }

  .export-btn {
    padding: 8px 32px;
    background: #4a90d9;
    color: #fff;
    border: none;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
  }

  .export-btn:hover {
    background: #3a7bc8;
  }
</style>
