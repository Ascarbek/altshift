<script lang="ts">
  import Player from './Player.svelte';
  import { AudioFiles, currentUser, showLogo } from './api/svelte-stores';
  import SignIn from './SignIn.svelte';
  import { onMount } from 'svelte';
  import { getAudioFiles, init } from './api/backend';
  import type { IAudioFile, IAuthor } from './api/types';

  export let videoId: string = '';
  export let videoType: string = '';
  export let showPlayer: boolean = true;

  onMount(async () => {
    await init();
  });

  const updateAudioFiles = async (videoType: string, videoId: string, user: IAuthor) => {
    $showLogo = true;
    if (!user?.token?.length) return;
    if (showPlayer && videoType?.length && videoId?.length) {
      const files = await getAudioFiles(videoType, videoId);
      $AudioFiles = files.map<IAudioFile>((item) => ({
        name: item.name,
        path: item.path,
        tags: item.tags,
        lang: item.lang,
      }));
    } else {
      $AudioFiles = [];
    }
    $showLogo = false;
  };

  $: updateAudioFiles(videoType, videoId, $currentUser);

  let showSignIn = false;
</script>

{#if showPlayer}
  <Player onShowSignIn="{() => (showSignIn = true)}" videoType="{videoType}" videoId="{videoId}" />
{/if}

{#if showSignIn}
  <SignIn onClose="{() => (showSignIn = false)}" />
{/if}
