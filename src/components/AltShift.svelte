<script lang='ts'>
  import Player from './Player.svelte';
  import { initFirebase, updateList, userSignEvent } from './api/firebase-app';
  import { AudioFiles, currentUser } from './api/svelte-stores';
  import SignIn from './SignIn.svelte';

  initFirebase();
  userSignEvent()

  export let videoId: string = '';
  export let videoType: string = '';

  export let showPlayer: boolean = true;

  $: updateList(videoType, videoId);

  let showSignIn = false;
</script>

{#if showPlayer}
  <Player onShowSignIn={() => showSignIn = true} videoType={videoType} videoId={videoId}
  />
{/if}

{#if showSignIn}
  <SignIn onClose={() => showSignIn = false} />
{/if}
