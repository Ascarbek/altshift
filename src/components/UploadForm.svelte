<script>
  import { tweened } from 'svelte/motion';
  import { cubicOut } from 'svelte/easing';
  import { fade } from 'svelte/transition';
  import {
    getTags,
    addNewTag,
    toggleTag,
  } from './api/api';

  import { tick } from 'svelte';
  import { createEventDispatcher } from 'svelte';
  import SuggestBox from './SuggestBox.svelte';

  const dispatch = createEventDispatcher();

  export let uploadProgress = 0;
  export let uploadComplete = false;

  export let audioName = '';
  let audioNameInput;

  export let languages = [];
  let selectedLanguage = [];
  export let selectedLanguageCode = '';

  export let tags = [];
  let tagName = '';

  async function onFileSelect(e) {
    const files = e.target.files;
    if(!files || files.length === 0) return;

    dispatch('startFileUpload', {
      file: files[0]
    });

    await tick();
    document.getElementById('upload-file-name-input').focus();
    audioNameInput.selectionStart = 0;
    audioNameInput.selectionEnd = audioName.length;
  }

  function toggleTagClick(tag) {
    dispatch('toggleTag', {
      label: tag.label
    });
  }

  function tagInputKeyDown(e) {
    switch (e.key) {
      case 'Enter': {
       dispatch('newTag', {
         label: tagName
       });
      } break;
    }
  }

  const setSelectedLanguage = item => selectedLanguage = [item];
  $: selectedLanguageCode = selectedLanguage && selectedLanguage.length ? selectedLanguage[0].code : null;

  const saveClick = e => dispatch('save');
</script>

<div class="upload-form" transition:fade>
  <div class="header">
    Upload an Audio
  </div>

  <div class="content">
    <div class="field upload-field">
      <input class="file-upload {uploadProgress > 0 ? 'hidden' : ''}" type="file" on:change={onFileSelect}>

      {#if uploadProgress > 0}
        {#if uploadComplete}
          <label>Upload complete.</label>
        {:else}
          <label>Uploading...</label>
        {/if}

        <div class="filename-color">{(uploadProgress*100).toFixed(0)}%</div>
        <div class="progress" style="width: calc({uploadProgress*100}% - 40px)">
          <div class="filename-white">{(uploadProgress*100).toFixed(0)}%</div>
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
          <input id="upload-file-name-input" type="text" bind:value={audioName} bind:this={audioNameInput}>
        </div>

        <div class="field">
          <label>Language</label>

          <SuggestBox items={languages} getSearchValue={item => item.displayName} cls="dropdown" multiSelect={false} onItemSelect={item => setSelectedLanguage(item)} bind:selectedItems={selectedLanguage}>
            <i slot="trigger-button" class="icomoon-arrow-down"></i>
          </SuggestBox>
        </div>
      </div>

      <div class="flex-col">
        <div class="field" style="margin-bottom: 0">
          <label>Tags / Features</label>
          <input type="text" bind:value={tagName} on:keydown={tagInputKeyDown}>
        </div>

        <div class="tag-cloud">
          {#each tags.filter(t => t.active) as tag}
            <span class="tag-item active" on:click={e => toggleTagClick(tag)}>{tag.label}</span>
          {/each}
          {#each tags.filter(t => !t.active) as tag}
            <span class="tag-item" on:click={e => toggleTagClick(tag)}>{tag.label}</span>
          {/each}
        </div>
      </div>
    </div>

    <div class="save-row">
      <button class="save-button" on:click={e => saveClick()}>Save</button>
    </div>

  </div>
</div>

<style>
  .upload-form {
    position: fixed;
    border-radius: 4px;

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
    background: #248dc1;
    color: #ffffff;
    padding: 15px 40px 15px;
    font-size: 22px;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
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
    background: #86939e;
    padding: 5px 8px;
    font-size: 10px;
    color: #ffffff;
    border-radius: 10px;
    margin-right: 10px;
  }

  .tag-item:hover {
    /*color: #248dc1;*/
  }

  .tag-item.active {
    background: #248dc1;
    color: #ffffff;
  }

  label {
    color: #86939e;
    display: block;
    font-size: 14px;
    margin-bottom: 10px;
  }

  .field input, .dropdown input {
    border: #86939e 1px solid;
    border-radius: 2px;
    display: block;
    outline: 0;
    padding: 6px;
    font-size: 14px;
    width: 100%;
    box-sizing: border-box;
  }

  .icomoon-arrow-down {
    color: #86939e;
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
    color: #248dc1;
  }

  .filename-white {
    left: 0;
    color: #ffffff;
  }

  .progress {
    background: #248dc1;
    position: absolute;
    height: 30px;
    bottom: 0;
    overflow: hidden;
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
    color: #248dc1;
  }

  .save-row {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .save-button {
    border: #248dc1 1px solid;
    background: #ffffff;
    color: #248dc1;
    border-radius: 6px;
    padding: 7px 0;
    width: 130px;
    outline: 0;
    /*border: none;*/
    cursor: pointer;
  }

  .save-button:hover {
    background: #248dc1;
    color: #ffffff;
  }

  .hidden {
    display: none !important;
  }
</style>
