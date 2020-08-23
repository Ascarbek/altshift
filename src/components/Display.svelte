<script lang="ts">
  import states from './displayStates';
  import type { PlayerData } from './types';

  export let state = '';
  export let data: PlayerData = null;

  $: console.log(data);

</script>

<!--

        font-size: 26px;
        color: #9e9e9e;

        <i class="fas fa-cloud-upload-alt"></i>
        <i class="fas fa-microphone-alt"></i>
-->

<div class="display-outer">
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
      <div class="audio-name">{data.audioName}</div>
    {:else if state === states.MENU}
    <span></span>
    {:else if state === states.NOT_FOUND}
    <span></span>
    {/if}
  </div>
</div>

<style>
  .lang {

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
