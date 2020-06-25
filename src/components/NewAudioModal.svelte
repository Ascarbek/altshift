<script>
  import { fade } from 'svelte/transition';

  export let onUploadClick = () => {};
  export let onRecordClick = () => {};
</script>

<div class="form" transition:fade>
  <button class="upload-button" on:click={e => onUploadClick()}>
    <i class="fas fa-cloud-upload-alt"></i>
  </button>
  <div class="delimeter"></div>
  <button class="record-button" on:click={e => onRecordClick()}>
    <i class="fas fa-microphone-alt"></i>
  </button>
</div>

<style>
  .form {
    background: #ffffff;
    width: 300px;
    height: 100px;
    position: fixed;
    z-index: 10000;
    margin: auto;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    align-items: center;
    border-radius: 10px;
    box-shadow: 0 0 5px 0 #000000;
  }

  button {
    background: none;
    border: none;
    outline: none;
    flex: 1;
    font-size: 60px;
    cursor: pointer;
    color: #9e9e9e;
  }

  button:hover {
    color: #248dc1;
  }

  .delimeter {
    width: 1px;
    background: #9e9e9e;
    height: 100%;
  }


</style>
