<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  export let currentTime: number;
  export let duration: number;

  const onMouseDown = (e) => {
    const width = e.target.clientWidth;
    const x = e.layerX;
    const time = duration * (x/width);
    dispatch('seek', { time });
    currentTime = time;
  }
</script>

<div class="track-outer">
  <div class="track-container" on:mousedown={onMouseDown}>
    <div class="cursor" style={`left: ${currentTime*100/duration}%`}></div>
  </div>
</div>

<style>
  .track-outer {
    user-select: none;

    position: fixed;
    z-index: 10000;

    left: 0.5vw;
    top: 0.5vw;
    width: 99vw;
    height: 80px;

    background: #f0f0f0;
    border: #e0e0e0 1px solid;
    border-radius: 4px;
    box-shadow: 0 0 3px 0 #000000;
  }

  .track-container {
    position: absolute;
    top: 3px;
    left: 3px;
    right: 3px;
    height: calc(100% - 6px);
    background: #beceb2;
    border-radius: 4px;
  }

  .cursor {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 1px;
    background: #e64b3d;
    box-shadow: 0 0 0 1px rgba(0,0,0,0.2);
  }
</style>
