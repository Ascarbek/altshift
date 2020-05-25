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

  $: {
    getList(videoId);
  }
</script>

<TrackList showOverlay={showOverlay} audioFiles={audioFiles} bind:currentFile={currentFile}>

</TrackList>

<!--
<AudioPlayer currentFile={currentFile}>

</AudioPlayer>

<UploadForm videoId={videoId} videoType={videoType}>

</UploadForm>
-->
<style>

</style>
