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
    padding: 10px 16px;
    display: flex;
    justify-content: center;
    flex-shrink: 0;
  }

  .export-btn {
    padding: 8px 36px;
    background: #4a90d9;
    color: #fff;
    border: none;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.15s;
  }

  .export-btn:hover {
    background: #3a7bc8;
  }

  .export-btn:active {
    background: #2d6cb0;
  }
</style>
