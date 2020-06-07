<script>
  import {
    getAudioFilesByVideoId,
    sendUploadForm,
  } from './api/api';

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

  let tags = [{
    label: 'censored',
  }, {
    label: 'uncensored',
  }, {
    label: 'parody',
  }]

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

  async function startFileUpload(event) {
    const {file} = event.detail;

    if (!uploadingAudioName || uploadingAudioName === '') {
      uploadingAudioName = file.name;
    }

    let data = [];

    data.push({'trackFile': file});
    data.push({videoType});
    data.push({videoId});

    const resp = await sendUploadForm(data, e => {
      progress.set(e.loaded / e.total);
    });

    fileName = resp.fileName;
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
    tags={tags}
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
