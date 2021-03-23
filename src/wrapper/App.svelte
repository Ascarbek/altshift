<script lang='ts'>
  import AltShift from './../components/AltShift.svelte';

  let showPlayer: boolean = true;
  // let videoId = 'uYGj04Iti3E';
  // let videoId = '-aQ2E0mlRQI';
  // let videoId: string = 's73k6J-q740';
  let videoId: string = 'f4g2nPY-VZc';
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
  on:play={() => a.play()}
  on:pause={() => a.pause()}
  on:seeked={() => a.currentTime = v.currentTime}
  class='v' controls muted='false'>
  <source src='http://localhost:8081/videoplayback.webm'>
</video>

<audio bind:this={a}>
  <source src='http://localhost:8081/videoplayback.weba'>
</audio>

<style>
  video {
    position: absolute;
    top: 200px;
    left: 20px;
    width: 800px;
  }

  audio {
    position: absolute;
    top: 50px;
  }
</style>
