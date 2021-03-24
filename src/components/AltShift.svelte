<script lang='ts'>
  import Player from './Player.svelte';
  import { initFirebase, updateList, signInRedirect } from './api/firebase-app';
  import { currentUser } from './api/svelte-stores';
  import SignIn from './SignIn.svelte';

  initFirebase();

  export let videoId: string = '';
  export let videoType: string = '';

  export let showPlayer: boolean = true;

  $: {
    currentUser && updateList(videoType, videoId);
  }

  const onSignInStart = () => {
    signInRedirect();
  };

  let showSignIn = false;
</script>

{#if showPlayer}
  <Player onShowSignIn={() => showSignIn = true} videoType={videoType} videoId={videoId}
          onSignInStart={onSignInStart} />
{/if}

{#if showSignIn}
  <SignIn onClose={() => showSignIn = false} />
{/if}
