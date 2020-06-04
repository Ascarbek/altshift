<script>
  import { tweened } from 'svelte/motion';
  import { cubicOut } from 'svelte/easing';
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

<div class="upload-button" class:second={secondStep}>
  <i class="icomoon-upload-audio"></i>
  <span>click to upload audio file</span>
  <input class="file-upload" type="file" on:change={onFileSelect}>
  <progress value={$progress}></progress>

  <div class="fields">
    <input class="audio-name" type="text" bind:value={audioName} placeholder="enter a title...">
    <SuggestBox items={['Казахский', 'Русский']}>
      <i slot="trigger-button" class="icomoon-chevron-down"></i>
    </SuggestBox>
    <button class="save-button" on:click={onSaveClick} >Save</button>
  </div>
</div>

<style>
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
    background: #fafafa;
  }

  progress::-webkit-progress-value {
    background: #248dc1;
  }

  i {
    display: block;
  }

  .upload-button {
    display: flex;
    align-items: center;
    flex-direction: column;
    color: #000000;
    padding: 10px 0;
    background: #fafafa;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
    cursor: pointer;
    position: relative;
    height: 63px;
  }

  .upload-button:hover i,
  .upload-button:hover span {
    color: #248dc1;
  }

  .upload-button > i {
    font-size: 36px;
    margin-bottom: 7px;
  }

  .upload-button > span {
    font-size: 10px;
    margin-bottom: 7px;
  }

  .file-upload {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    opacity: 0;
  }

  .upload-button.second > i,
  .upload-button.second > span,
  .upload-button.second .file-upload {
    display: none;
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

  .upload-button.second .fields {
    display: flex;
  }

  .upload-button.second progress {
    display: block;
  }
</style>
