<script>
  import AltShift from './../components/AltShift.svelte';

  let showPlayer = true;
  let videoId = 'uYGj04Iti3E';
  // let videoId = '-aQ2E0mlRQI';
  let videoType = 'YOUTUBE_VIDEO_PAGE';
</script>

<input type="checkbox" bind:checked={showPlayer}>
<input type="text" bind:value={videoId}>
<input type="text" bind:value={videoType}>

<AltShift showPlayer={showPlayer} videoId={videoId} videoType={videoType}>

</AltShift>


<video controls muted=true>
  <source src="https://firebasestorage.googleapis.com/v0/b/alt-shift.appspot.com/o/test%2Fplane-highway.mp4?alt=media&token=04afd0d6-fa9c-4a2a-90e1-996277e90c04">
</video>
