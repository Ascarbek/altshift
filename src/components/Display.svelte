<script>
  import states from './displayStates';

  export let state = '';
  export let data = {};

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
    {:else if state === states.LOGO}
    {:else if state === states.HOME && data.tags && data.tags.length}
      <div class="lang">{data.lang}</div>
      <div class="tags">
        {#each data.tags as tag}
          <div class="tag-item">{tag}</div>
        {/each}
      </div>
      <div class="audio-name">{data.audioName}</div>
    {:else if state === states.MENU}
    {:else if state === states.NOT_FOUND}

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
