<script lang="ts">
  import Player from "./Player.svelte";
  import type { AudioFile } from './api/types';
  import { updateList } from './api/firebase-app';

  export let videoId = '';
  export let videoType = '';

  export let showPlayer = true;

  $: {
    updateList(videoType, videoId);
  }
</script>

{#if showPlayer}
  <Player/>
{/if}
