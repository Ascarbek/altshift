<script lang='ts'>
  import type { IAudioFile } from './api/types';
  import { DisplayStates } from './api/types';

  export let state: DisplayStates;
  export let data: IAudioFile = null;

  export let progress = 0;

  export let menuItemIndex: number = 0;
</script>

<div class='display-outer'>
  <input id='upload-input' type='file' style='display: none'>
  <div class='display'>
    {#if false}
      <span></span>
    {:else if state === DisplayStates.LOGO}
      <div class='logo'>
        <span>
          AltShift
        </span>
      </div>
    {:else if state === DisplayStates.HOME && data}
      <div class='lang'>{data.lang}</div>
      <div class='tags'>
        {#each data.tags as tag}
          <div class='tag-item'>{tag}</div>
        {/each}
      </div>
      <div class='audio-name'>{data.name}</div>
    {:else if state === DisplayStates.MENU}
      <div class='menu'>
        <button class='menu-item active' class:active={menuItemIndex === 0}><i class='fas fa-microphone-alt'></i>
        </button>
        <button class='menu-item active' class:active={menuItemIndex === 1}><i class='fas fa-cloud-upload-alt'></i>
        </button>
      </div>
    {:else if state === DisplayStates.UPLOAD_PROGRESS}
      {#each [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] as p}
        <div class='upload-progress fill' class:fill={progress > p*10+5} style={`left: ${30 + p*15}px`}>
        </div>
      {/each}
    {:else if state === DisplayStates.RECORDER}
      <slot name='recorder' />
    {:else if state === DisplayStates.NOT_FOUND}
      <span></span>
    {/if}
  </div>
</div>

<style>
  .logo {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    font-size: 20px;
  }

  .menu {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
  }

  .upload-progress {
    background: #9e9e9e;
    width: 13px;
    height: 2px;
    bottom: 9px;
    position: absolute;
  }

  .upload-progress.fill {
    height: 20px;
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

  .menu-item.active {
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
    letter-spacing: 1px;
    display: flex;
    align-items: center;
    font-size: 12px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: clip;
  }

  .audio-name {
    padding: 0 8px;
  }
</style>
