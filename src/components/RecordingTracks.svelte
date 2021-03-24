<script lang='ts'>
  import { createEventDispatcher } from 'svelte';
  import { ProjectName, Voices, CurrentParts } from './api/svelte-stores';

  const dispatch = createEventDispatcher();

  export let currentTime: number;
  export let duration: number;

  const onMouseDown = (e) => {
    const width = e.target.clientWidth;
    const x = e.layerX;
    const time = duration * (x / width);
    dispatch('seek', { time });
    currentTime = time;
  };

  let showToolbarButtons = false;
  export let onProjectNameChange: (v: string) => void;

</script>

<div class='project-name'>
  <input bind:value={$ProjectName} on:blur={(e) => onProjectNameChange(e.target.value)}>
</div>

{#each $Voices as voice}
  <div class='track-outer'>

    <div class='track-container' on:mousedown={onMouseDown}>
      <div class='cursor' style={`left: ${currentTime*100/duration}%`}></div>
    </div>
    <div class='toolbar' on:mouseenter={() => showToolbarButtons = true}
         on:mouseleave={() => showToolbarButtons = false}>
      <div class='name'>
        <input bind:value={voice.name}>
        {#if showToolbarButtons}
          <div class=''>
            <button>
              <i class='fas fa-plus'></i>
            </button>
          </div>
        {/if}
      </div>
    </div>
  </div>
{/each}


<style>
  .project-name {
    position: fixed;
    left: 10px;
    top: 5px;
    width: 100vw;
    height: 40px;
    background: #ffffff;
  }

  .track-outer {
    user-select: none;

    position: fixed;
    z-index: 10000;

    left: 0.5vw;
    top: calc(0.5vw + 40px);
    width: 99vw;
    height: 80px;

    background: #f0f0f0;
    border: #e0e0e0 1px solid;
    border-radius: 4px;
    box-shadow: 0 0 3px 0 #000000;
  }

  .toolbar {
    position: absolute;
    top: 5px;
    left: 10px;
  }

  .name {
    display: flex;

  }

  input {
    font-family: 'Roboto Mono', monospace;
    font-weight: bold;
    background: none;
    border: none;
    outline: none;
    padding-bottom: 5px;
  }

  input:focus {
    border-bottom: 1px solid #000000;
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
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.2);
  }
</style>
