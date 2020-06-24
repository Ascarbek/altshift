<script>
  import {
    getAudioFilesByVideoId,
    sendUploadForm,

    getTags,
    addNewTag,
    toggleTag,
  } from './api/api';

  import { onMount } from 'svelte';

  import UploadForm from "./UploadForm.svelte";
  import NewAudioModal from "./NewAudioModal.svelte";
  import Overlay from "./Overlay.svelte";

  export let videoId = '';
  export let videoType = '';

  let overlayAvailable = false;

  export let showOverlay = false;
  let showNewAudioModal = false;
  let showUploadForm = true;

  let audioFiles = [];
  let currentFile = '';

  let uploadingAudioName = '';
  let uploadedFileName = '';
  let uploadComplete = false;
  let initialFileName = '';

  let tags = [];

  let uploadProgress = 0;

  onMount(() => {
    loadAllTags()
  });

  async function getList(id) {
    try {
      audioFiles = await getAudioFilesByVideoId(id, videoType);
      if (audioFiles.length) {
        overlayAvailable = true;
      }
    } catch (e) {
      console.error('getList error:');
      console.error(e);
    }
  }

  $: {
    getList(videoId);
  }

  async function loadAllTags() {
    tags = await getTags();
  }

  async function onNewTag(e) {
    await addNewTag({
      videoId,
      videoType,
      audioFileName: uploadedFileName,
      label: e.detail.label,
    });
    tags = [...tags, {label: e.detail.label, active: true}]
  }

  async function onToggleTag(e) {
    await toggleTag({
      videoId,
      videoType,
      audioFileName: uploadedFileName,
      label: e.detail.label,
    });

    tags = tags.map(t => { return {
      ...t,
      active: t.label === e.detail.label ? !t.active : t.active
    }});
  }


  async function startFileUpload(event) {
    const {file} = event.detail;

    if (!uploadingAudioName || uploadingAudioName === '') {
      uploadingAudioName = file.name;
      initialFileName = file.name;
    }

    let data = [];

    data.push({'trackFile': file});
    data.push({videoType});
    data.push({videoId});

    const resp = await sendUploadForm(data, e => {
      uploadProgress = e.loaded / e.total;
    });

    uploadedFileName = resp.fileName;

    uploadComplete = true;

  }

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
  }

  function newAudio(e) {
    const {
      audioName,
      fileName,
    } = e.detail;

    audioFiles = [...audioFiles, {audioName, fileName}];
  }

  /**
   * TEST
   * */
  function onOverlayClick() {
    showOverlay = false;
    setTimeout(() => {
      showOverlay = true;
      overlayAvailable = true;
    }, 1000);
  }
</script>

{#if showOverlay}
  <Overlay
    on:click={onOverlayClick}
    available={overlayAvailable}
  />
{/if}

{#if showNewAudioModal}
  <NewAudioModal
  />
{/if}

{#if showUploadForm}
  <UploadForm
    on:startFileUpload={startFileUpload}
    bind:audioName={uploadingAudioName}
    bind:uploadComplete={uploadComplete}

    on:newTag={onNewTag}
    on:toggleTag={onToggleTag}
    tags={tags}
    uploadProgress={uploadProgress}
  />
{/if}

        <!--
<TrackList
  showOverlay={showOverlay}
  videoId={videoId}
  videoType={videoType}
  audioFiles={audioFiles}
  bind:currentFile={currentFile}
  on:audioSaved={newAudio}
/>
-->


<!--
<AudioPlayer currentFile={currentFile}>

</AudioPlayer>

<UploadForm videoId={videoId} videoType={videoType}>

</UploadForm>
-->
<style>

</style>
