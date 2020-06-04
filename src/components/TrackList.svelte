<script>

  import { fade } from 'svelte/transition';
  import UploadForm from "./UploadForm.svelte";

  export let audioFiles = [];
  export let currentFile = '';
  export let showOverlay = false;
  export let videoId = '';
  export let videoType = '';

  let showList = false;

  function onOverlayClick() {
    showList = !showList;
  }



</script>



{#if showList && showOverlay}
  <div class="track-list" transition:fade={{duration: 250}}>
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

<style>


  .track-list {
    width: 300px;
    position: fixed;
    top: 70px;
    right: 70px;
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
