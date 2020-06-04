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
  export let showOverlay = false;

  let audioFiles = [];
  let currentFile = '';

  let uploadingAudioName = '';

  async function getList(id) {
    audioFiles = await getAudioFilesByVideoId(id, videoType);
  }

  function newAudio(e) {
    const {
      audioName,
      fileName,
    } = e.detail;

    audioFiles = [...audioFiles, {audioName, fileName}];
  }

  $: {
    getList(videoId);
  }

  let overlayAvailable = false;

  function onOverlayClick() {
    showOverlay = false;
    setTimeout(() => {
      showOverlay = true;
      overlayAvailable = true;
    }, 1000);
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

  let showNewAudioModal = true;


</script>

<!--
<UploadForm
  on:startFileUpload={startFileUpload}
  bind:audioName={uploadingAudioName}
/>
-->
{#if showOverlay}
  <Overlay
    on:click={onOverlayClick}
    available={overlayAvailable}
  />
{/if}

{#if showNewAudioModal}
  <NewAudioModal/>
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
