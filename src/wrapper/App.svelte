<script>
  import AltShift from './../components/AltShift.svelte';

  let showPlayer = true;
  let videoId = 'uYGj04Iti3E';
  let videoType = 'YOUTUBE_VIDEO_PAGE';
</script>

<input type="checkbox" bind:checked={showPlayer}>
<input type="text" bind:value={videoId}>
<input type="text" bind:value={videoType}>

<AltShift showPlayer={showPlayer} videoId={videoId} videoType={videoType}>

</AltShift>
