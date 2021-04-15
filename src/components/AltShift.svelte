<script lang='ts'>
  import Player from './Player.svelte';
  import { getDefaultProjectName, initialize, updateList } from './api/supabase-app';
  import { currentUser, supabase } from './api/svelte-stores';
  import SignIn from './SignIn.svelte';
  import { onMount } from 'svelte';

  onMount(async () => {
    $supabase = initialize();
    const user = $supabase.auth.user();
    if (user?.id?.length) {
      $currentUser = {
        email: user.email,
        uid: user.id,
        defaultProjectName: await getDefaultProjectName(user.id, $supabase),
      };
    }
  });

  export let videoId: string = '';
  export let videoType: string = '';

  export let showPlayer: boolean = true;

  $: updateList(videoType, videoId, $supabase);

  let showSignIn = false;
</script>

{#if showPlayer}
  <Player onShowSignIn={() => showSignIn = true} videoType={videoType} videoId={videoId}
  />
{/if}

{#if showSignIn}
  <SignIn onClose={() => showSignIn = false}
  />
{/if}
