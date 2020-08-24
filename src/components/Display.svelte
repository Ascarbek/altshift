<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  import states from './displayStates';
  import type { AudioFile } from './api/types';

  export let state = '';
  export let data: AudioFile = null;

  const uploadClick = (e) => {
    dispatch('uploadClick');
  }
</script>

<div class="display-outer">
  <input id='upload-input' type="file" style="display: none">
  <div class="display">
    {#if false}
    <span></span>
    {:else if state === states.LOGO}
    <span></span>
    {:else if state === states.HOME && data}
      <div class="lang">{data.lang}</div>
      <div class="tags">
        {#each data.tags as tag}
          <div class="tag-item">{tag}</div>
        {/each}
      </div>
      <div class="audio-name">{data.name}</div>
    {:else if state === states.MENU}
      <div class="menu">
        <button class="menu-item" on:click={uploadClick}><i class="fas fa-cloud-upload-alt"></i></button>
        <button class="menu-item"><i class="fas fa-microphone-alt"></i></button>
      </div>
    {:else if state === states.NOT_FOUND}
    <span></span>
    {/if}
  </div>
</div>

<style>
  .lang {

  }

  .menu {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
  }

  .menu-item {
    margin: 0 10px;
    font-size: 26px;
    color: #9e9e9e;
    border: none;
    background: none;
    outline: 0;
    padding: 0;
    cursor: pointer;
  }

  .menu-item:hover {
    color: #777777;
  }

  .display-outer {
    position: absolute;
    top: 10px;
    left: 45px;
    right: 90px;
    height: calc(100% - 20px);
    background: #f0f0f0;
    border: #e0e0e0 1px solid;
    border-radius: 4px;
  }

  .display {
    position: absolute;
    top: 3px;
    left: 3px;
    right: 3px;
    height: calc(100% - 6px);
    background: #beceb2;
    border-radius: 4px;
    color: #464c4b;
    font-family: 'Roboto Mono', monospace;
    display: flex;
    align-items: center;
    font-size: 12px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: clip;
  }
</style>
