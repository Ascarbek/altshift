<script>
  import { tweened } from 'svelte/motion';
  import { cubicOut } from 'svelte/easing';
  import { fade } from 'svelte/transition';
  import { createEventDispatcher } from 'svelte';
  import SuggestBox from 'svelte-suggestbox';

  const dispatch = createEventDispatcher();

  /*  const progress = tweened(0, {
      duration: 300,
      easing: cubicOut,
    });*/

  export let videoId = '';
  export let videoType = '';

  export let audioName = '';
  export let initialFileName = '';
  let fileName = '';
  export let uploadProgress = 0;

  export let tags = [];

  function onFileSelect(e) {
    const files = e.target.files;
    if(!files || files.length === 0) return;

    dispatch('startFileUpload', {
      file: files[0]
    });
  }
</script>

<div class="upload-form" transition:fade>
  <div class="header">
    Upload an Audio
  </div>

  <div class="content">
    <div class="field upload-field">
      <input class="file-upload {uploadProgress > 0 ? 'hidden' : ''}" type="file" on:change={onFileSelect}>

      {#if uploadProgress > 0}
        <label>Uploading</label>
        <div class="filename-color">{(uploadProgress*100).toFixed(1)}%</div>
        <div class="progress" style="width: calc({uploadProgress*100}% - 40px)">
          <div class="filename-white">{(uploadProgress*100).toFixed(1)}%</div>
        </div>
      {/if}

      {#if uploadProgress === 0}
        <label>Select a file</label>
        <div class="upload-button"><i class="icomoon-upload"></i></div>
      {/if}
    </div>

    <div class="flex-row">
      <div class="flex-col">
        <div class="field">
          <label>Title / Name</label>
          <input type="text" bind:value={audioName}>
        </div>

        <div class="field">
          <label>Language</label>
          <input type="text">
        </div>
      </div>

      <div class="flex-col">
        <div class="field">
          <label>Tags / Features</label>
          <input type="text">
        </div>

        <div class="tag-cloud">
          {#each tags as tag}
            <span class="tag-item">{tag.label}</span>
          {/each}
        </div>
      </div>
    </div>

    <div class="save-row">
      <button class="save-button">Save</button>
    </div>

  </div>

  <!--<i class="icomoon-upload-audio"></i>
  <span>click to upload audio file</span>
  <input class="file-upload" type="file" on:change={onFileSelect}>
  <progress value={$progress}></progress>

  <div class="fields">
    <input class="audio-name" type="text" bind:value={audioName} placeholder="enter a title...">
    <SuggestBox items={['Казахский', 'Русский']}>
      <i slot="trigger-button" class="icomoon-chevron-down"></i>
    </SuggestBox>
    <button class="save-button" on:click={onSaveClick} >Save</button>
  </div>-->
</div>

<style>
  .upload-form {
    position: fixed;
    border-radius: 10px;

    background: #ffffff;
    box-shadow: 0 0 5px 0 #000000;

    margin: auto;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    width: 700px;
    height: 400px;
  }

  .header {
    background: #838cc7;
    color: #ffffff;
    padding: 15px 40px 15px;
    font-size: 22px;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
  }

  .content {
    padding-top: 20px;
  }

  .field {
    margin-bottom: 20px;
    padding: 0 20px;
  }

  .flex-row {
    display: flex;
  }

  .flex-col {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .tag-cloud {
    padding: 10px 20px;
  }

  .tag-item {
    cursor: pointer;
    background: #bdc6cf;
    padding: 5px 8px;
    font-size: 10px;
    color: #ffffff;
    border-radius: 10px;
    margin-right: 10px;
  }

  label {
    color: #86939e;
    display: block;
    font-size: 14px;
    margin-bottom: 10px;
  }

  .field input {
    border: #e1e8ee 2px solid;
    border-radius: 4px;
    display: block;
    outline: 0;
    padding: 6px;
    font-size: 14px;
    width: 100%;
    box-sizing: border-box;
  }

  .filename-color, .filename-white {
    position: absolute;
    bottom: 5px;
    width: 660px;
    text-align: center;
    font-size: 14px;
  }

  .filename-color {
    left: 20px;
    color: #3f9ad0;
  }

  .filename-white {
    left: 0;
    color: #ffffff;
  }

  .progress {
    background: #3f9ad0;
    position: absolute;
    height: 30px;
    bottom: 0;
    overflow: hidden;
  }

  progress {
    width: calc(100% - 40px);
    -webkit-appearance: none;
    appearance: none;
    position: absolute;
    height: 30px;
    bottom: 0;
  }

  progress::-webkit-progress-bar {
    background: #ffffff;
  }

  progress::-webkit-progress-value {
    background: #3f9ad0;
  }

  i {
    display: block;
  }

  .upload-field {
    position: relative;
    color: #86939e;
    cursor: pointer;
    height: 77px;
  }

  .file-upload {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    opacity: 0;
    cursor: pointer;
  }

  .upload-button {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 48px;
    width: 100%;
    font-size: 48px;
  }

  .upload-field:hover {
    color: #3e99d1;
  }

  .save-row {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .save-button {
    background: #7dc855;
    color: #ffffff;
    border-radius: 6px;
    padding: 7px 0;
    width: 130px;
    outline: 0;
    border: none;
  }

  .hidden {
    display: none !important;
  }
</style>
