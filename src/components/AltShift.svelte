<script lang='ts'>
  import Player from './Player.svelte';
  import { initFirebase, updateList } from './api/firebase-app';

  initFirebase();

  export let videoId: string = '';
  export let videoType: string = '';

  export let showPlayer: boolean = true;

  $: {
    updateList(videoType, videoId);
  }
</script>

{#if showPlayer}
  <Player videoType={videoType} videoId={videoId} />
{/if}
