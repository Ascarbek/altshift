<script lang='ts'>
  import AltShift from './../components/AltShift.svelte';

  let showPlayer: boolean = true;
  // let videoId = 'uYGj04Iti3E';
  // let videoId = '-aQ2E0mlRQI';
  // let videoId: string = 's73k6J-q740';
  // let videoId: string = 'f4g2nPY-VZc';
  let videoId: string = '22H8M8h6Hdo';
  let videoType: string = 'YOUTUBE_VIDEO_PAGE';

  let v, a;
</script>

<input type='checkbox' bind:checked={showPlayer}>
<input type='text' bind:value={videoId}>
<input type='text' bind:value={videoType}>

<AltShift showPlayer={showPlayer} videoId={videoId} videoType={videoType}>

</AltShift>

<video
  bind:this={v}
  class='v' controls >
  <source src='http://localhost:8081/tu114.mp4'>
</video>

<style>
  video {
    position: absolute;
    top: 200px;
    left: 20px;
    width: 800px;
  }
</style>
