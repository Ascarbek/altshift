<script>
  import { spring } from 'svelte/motion';
  import { onMount } from 'svelte';

  export let audioFiles = [];
  export let currentFile = '';
  export let showOverlay = false;

  let showList = false;

  let scale = spring({ size: 0 }, {
    stiffness: 0.1,
    damping: 0.4
  });

  let handle;

  function setVisibility(v) {
    clearTimeout(handle);
    if(v) {
      handle = setTimeout(() => {
        scale.set({ size: 100 });
        scale.damping = 0.25;
      }, 500);
    }
    else {
      handle = setTimeout(() => {
        scale.set({ size: 0 });
        scale.damping = 0.4;
      }, 500);
    }
  }

  $: showOverlay ? setVisibility(true) : setVisibility(false);

</script>

{#if showList}
  <ul>
    {#each audioFiles as file}
      <li on:click={() => currentFile = file}>
        {file.audioName}
      </li>
    {/each}
  </ul>
{/if}

<div class="app-overlay" style="transform: scale({$scale.size/100})">
  <i class="icon-headset"></i>
</div>

<style>
  .app-overlay {
    position: fixed;
    right: 30px;
    top: 70px;
    z-index: 1;
    color: #248dc1;
    font-size: 24px;
    width: 40px;
    height: 40px;
    background: #ffffff;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 0 5px 0 #000000;
  }

  i {
    display: block;
  }

  ul {
    position: fixed;
    top: 50px;
    z-index: 10000;
    color: #ffffff;
  }
</style>
