<script lang='ts'>
  import AltShift from './../components/AltShift.svelte';
  import { onMount } from 'svelte';

  let isAuth = false;

  onMount(() => {
    if (location.pathname.substr(1, 5) === 'auth_') {
      const token = location.pathname.substr(6);
      console.log('token ', token);
      isAuth = true;
    }

    v.volume = 0.1;
  });

  let showPlayer: boolean = true;
  // let videoId = 'uYGj04Iti3E';
  // let videoId = '-aQ2E0mlRQI';
  // let videoId: string = 's73k6J-q740';
  // let videoId: string = 'f4g2nPY-VZc';
  let videoId: string = '22H8M8h6Hdo';
  // let videoId: string = '5nLWTVTwOhY';
  let videoType: string = 'YOUTUBE_VIDEO_PAGE';

  let v;

</script>

<div class='viewport'>
  <input type='checkbox' bind:checked={showPlayer}>
  <input type='text' bind:value={videoId}>
  <input type='text' bind:value={videoType}>

  <AltShift showPlayer={showPlayer} videoId={videoId} videoType={videoType}>

  </AltShift>

  <video
    bind:this={v}
    class='v' controls

  >
    <source src='http://localhost:8081/tu114.mp4'>
  </video>
</div>

<style>
  video {
    position: absolute;
    top: 200px;
    left: 20px;
    width: 800px;
  }

  .viewport {
    width: 100vw;
    height: 100vh;
    background: #222222;
  }
</style>
