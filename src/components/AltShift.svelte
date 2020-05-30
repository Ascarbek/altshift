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
    const url = new URL('https://localhost:5010/get-by-video-id');

    url.searchParams.append('videoId', id);
    url.searchParams.append('videoType', videoType);

    const resp = await window.fetch(url.toString())
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
