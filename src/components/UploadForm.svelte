<script>
  import { tweened } from 'svelte/motion';
  import { cubicOut } from 'svelte/easing';
  import { fade } from 'svelte/transition';
  import { createEventDispatcher } from 'svelte';
  import SuggestBox from 'svelte-suggestbox';

  const dispatch = createEventDispatcher();

  const progress = tweened(0, {
    duration: 300,
    easing: cubicOut,
  });

  export let videoId = '';
  export let videoType = '';

  export let audioName = '';
  let fileName = '';

  export let tags = [];


  const saveFieldsUrl = `https://localhost:5010/save-fields`;

  let secondStep = false;





  async function onSaveClick() {
    await window.fetch(saveFieldsUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        audioName,
        videoId,
        videoType,
        fileName,
      })
    });

    dispatch('audioSaved', {
      audioName,
      fileName,
    });

    secondStep = false;
    progress.set(0);
  }

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
    <div class="field">
      <label>Select a file</label>
      <progress value="0.5"></progress>

    </div>

    <div class="flex-row">
      <div class="flex-col">
        <div class="field">
          <label>Title / Name</label>
          <input type="text">
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
    height: 350px;
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

  progress {
    display: none;
    width: 100%;
    -webkit-appearance: none;
    appearance: none;
    position: absolute;
    height: 7px;
    top: 0;
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

  .file-upload {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    opacity: 0;
  }

  .fields {
    position: absolute;
    display: none;
    align-items: center;
    left: 28px;
    top: 22px;
    flex-direction: column;
  }

  .audio-name {
    border: none;
    border-bottom: #aaaaaa 1px solid;
    padding: 3px;
    font-size: 12px;
    color: #000000;
    outline: 0;
    width: 200px;
  }

  .save-button {
    color: #000000;
  }
</style>
