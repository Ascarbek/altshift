<script lang="ts">
  import AltShift from './../components/AltShift.svelte';
  import { onMount } from 'svelte';

  let isAuth = false;

  onMount(() => {
    if (location.pathname.substr(1, 5) === 'auth_') {
      const token = location.pathname.substr(6);
      console.log('token ', token);
      isAuth = true;
    }

    // v.volume = 0.45;
  });

  let showPlayer: boolean = true;
  // let videoId = 'uYGj04Iti3E';
  // let videoId = '-aQ2E0mlRQI';
  // let videoId: string = 's73k6J-q740';
  // let videoId: string = 'f4g2nPY-VZc';
  // let videoId: string = '22H8M8h6Hdo';
  let videoId: string = '5nLWTVTwOhY';
  let videoType: string = 'YOUTUBE_VIDEO_PAGE';

  let v;
</script>

<div class="viewport">
  <AltShift showPlayer="{showPlayer}" videoId="{videoId}" videoType="{videoType}" />

  <div class="test">
    <input type="checkbox" bind:checked="{showPlayer}" />
    <input type="text" bind:value="{videoId}" />
    <input type="text" bind:value="{videoType}" />
  </div>

  <video bind:this="{v}" class="v" controls>
    <source src="http://localhost:8081/canyoutrust.mp4" />
  </video>
</div>

<style>
  video {
    position: absolute;
    top: 300px;
    left: 20px;
    width: 800px;
  }

  .viewport {
    width: 100vw;
    height: 100vh;
    background: #ffffff;
  }

  .test {
    position: absolute;
    top: 127px;
    left: 30px;
    display: flex;
    align-items: center;
  }
</style>
