<script>
  import {spring, tweened} from 'svelte/motion';
  import {cubicOut} from 'svelte/easing';
  import UploadForm from "./UploadForm.svelte";

  const listOpacity = tweened(0, {
    duration: 500,
    easing: cubicOut
  });

  export let audioFiles = [];
  export let currentFile = '';
  export let showOverlay = false;
  export let videoId = '';
  export let videoType = '';

  let showList = false;

  let scale = spring({size: 0}, {
    stiffness: 0.1,
    damping: 0.4
  });

  let handle;

  function setVisibility(v) {
    clearTimeout(handle);
    if (v) {
      handle = setTimeout(() => {
        scale.set({size: 100});
        scale.damping = 0.25;
      }, 500);
    } else {
      if (showList) onOverlayClick();

      handle = setTimeout(() => {
        scale.set({size: 0});
        scale.damping = 0.4;
      }, 500);
    }
  }

  function onOverlayClick() {
    if (showList) {
      listOpacity.set(0);
      showList = false;
    } else {
      listOpacity.set(1);
      showList = true;
    }
  }

  $: showOverlay ? setVisibility(true) : setVisibility(false);

</script>

{#if $listOpacity > 0}
  <div class="track-list" style="opacity: {$listOpacity}">
    <ul>
      {#each audioFiles as file}
        <li on:click={() => currentFile = file} class:active={currentFile.fileName === file.fileName}>
          <i class="audio-icon icomoon-volume2"></i>
          <span class="audio-name">{file.audioName}</span>
        </li>
      {/each}
      {#if !audioFiles || !audioFiles.length}
        <li class="not-found">
          no audios found, you can upload or record your own
        </li>
      {/if}
    </ul>
    <UploadForm videoId={videoId} videoType={videoType} on:audioSaved/>
  </div>
{/if}

<div class="app-overlay" style="transform: scale({$scale.size/100})" on:click={onOverlayClick}>
  <i class="icomoon-headset"></i>
</div>

<style>
  .app-overlay {
    position: fixed;
    right: 30px;
    top: 70px;
    z-index: 10000;
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

  .track-list {
    width: 300px;
    position: fixed;
    top: 90px;
    right: 50px;
    z-index: 10000;
    background: #ffffff;
    border-radius: 10px;
  }

  ul {
    margin: 0;
    list-style-type: none;
    padding: 14px 0;
    width: 100%;
    border-bottom: #dddddd 1px solid;
  }

  li {
    padding: 4px 14px;
    color: #248dc1;
    font-size: 16px;
    display: flex;
    align-items: center;
    cursor: pointer;
  }

  li.not-found {
    color: #888888;
    font-size: 11px;
  }

  li:hover {
    background: #efefef;
  }

  li.active .audio-icon {
    opacity: 1;
  }

  li.active .audio-name {
    color: #248dc1;
  }

  .audio-icon {
    font-size: 24px;
    color: #248dc1;
    margin-right: 7px;
    opacity: 0;
  }

  .audio-name {
    color: #000000;
  }


</style>
