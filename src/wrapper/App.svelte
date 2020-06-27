<script>
  import AltShift from './../components/AltShift.svelte';

  let showOverlay = true;
  let videoId = '70295829';
  let videoType = 'NETFLIX_VIDEO_PAGE';
</script>

<input type="checkbox" bind:checked={showOverlay}>
<input type="text" bind:value={videoId}>
<input type="text" bind:value={videoType}>

<AltShift showOverlay={showOverlay} videoId={videoId} videoType={videoType}>

</AltShift>
