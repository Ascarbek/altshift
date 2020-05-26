<script>
  import TrackList from './TrackList.svelte';
  import AudioPlayer from './AudioPlayer.svelte';
  import UploadForm from "./UploadForm.svelte";

  export let videoId = '';
  export let videoType = '';
  export let showOverlay = false;

  let audioFiles = [];
  let currentFile = '';

  async function getList(id) {
    const resp = await window.fetch('https://localhost:5010/get-by-video-id?videoId=' + id)
    const parsed = await resp.json();
    audioFiles = parsed.audioFiles;
  }

  function newAudio(e) {
    const {
      audioName,
      fileName,
    } = e.detail;

    audioFiles = [...audioFiles, { audioName, fileName }];
  }

  $: {
    getList(videoId);
  }
</script>

<TrackList
  showOverlay={showOverlay}
  videoId={videoId}
  videoType={videoType}
  audioFiles={audioFiles}
  bind:currentFile={currentFile}
  on:audioSaved={newAudio}
/>


<!--
<AudioPlayer currentFile={currentFile}>

</AudioPlayer>

<UploadForm videoId={videoId} videoType={videoType}>

</UploadForm>
-->
<style>

</style>
