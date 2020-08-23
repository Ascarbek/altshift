<script lang="ts">
  import {
    getAudioFilesByVideoId,
    sendUploadForm,

    saveAudioFile,

    getTags,
    addNewTag,
    toggleTag,
  } from './api/api';

  import { onMount } from 'svelte';

  import UploadForm from "./UploadForm.svelte";

  import Overlay from "./Overlay.svelte";
  import Player from "./Player.svelte";
  import type { AudioFile } from './types';

  export let videoId = '';
  export let videoType = '';

  let overlayAvailable = false;

  let showOverlay = false;
  let showNewAudioModal = false;
  let showUploadForm = false;
  export let showPlayer = true;

  let audioFiles = [];
  let playerData: AudioFile = null;

  let uploadingAudioName = '';
  let uploadedFileName = '';
  let uploadComplete = false;
  let initialFileName = '';

  let tags = [];
  let languages = [{
    code: 'ru',
    displayName: 'Русский'
  }, {
    code: 'en',
    displayName: 'English'
  }, {
    code: 'kz',
    displayName: 'Казахский'
  }];
  let selectedLanguageCode = '';

  let uploadProgress = 0;

  onMount(() => {
    loadAllTags()
  });

  async function getList(id: string) {
    try {
      audioFiles = await getAudioFilesByVideoId(id, videoType);
      if (audioFiles.length) {
        // overlayAvailable = true;
        showPlayer = true;
        // currentFile = audioFiles[0].fileName;
        // currentAudioName = audioFiles[0].audioName;
        playerData = audioFiles[0];
      }
      else {
        // showOverlay = true;
        // currentFile = '';
        // currentAudioName = 'no audio found...'
        playerData = null;
        showPlayer = false;
      }
    } catch (e) {
      console.error('getList error:');
      console.error(e);
    }
  }

  $: {
    getList(videoId);
  }

  async function loadAllTags() {
    tags = await getTags();
  }

  async function onNewTag(e) {
    tags = [...tags, {label: e.detail.label, active: true, isNew: true}];
  }

  async function onToggleTag(e) {
    tags = tags.map(t => { return {
      ...t,
      active: t.label === e.detail.label ? !t.active : t.active
    }});
  }

  async function startFileUpload(event) {
    const {file} = event.detail;

    if (!uploadingAudioName || uploadingAudioName === '') {
      uploadingAudioName = file.name;
      initialFileName = file.name;
    }

    let data = [];

    data.push({'trackFile': file});
    data.push({videoType});
    data.push({videoId});

    const resp = await sendUploadForm(data, e => {
      uploadProgress = e.loaded / e.total;
    });

    uploadedFileName = resp.fileName;
    uploadComplete = true;
  }

  async function onSaveClick() {
    await saveAudioFile({
      videoId,
      videoType,
      audioFileName: uploadedFileName,
      audioName: uploadingAudioName,
      lang: selectedLanguageCode,
      tags: tags.filter(t => t.active)
    });

    showUploadForm = false;
  }

  function newAudio(e) {
    const {
      audioName,
      fileName,
    } = e.detail;

    audioFiles = [...audioFiles, {audioName, fileName}];
  }

  const onUploadClick = () => {
    showUploadForm = true;
    showNewAudioModal = false;
  }

  const onRecordClick = () => {
    showUploadForm = false;
    showNewAudioModal = false;
  }


  const onDownClick = e => {
    const video = document.getElementsByTagName('video');
  }

</script>

{#if showUploadForm}
  <UploadForm
    on:startFileUpload={startFileUpload}
    uploadProgress={uploadProgress}
    uploadComplete={uploadComplete}

    bind:audioName={uploadingAudioName}
    languages={languages}
    bind:selectedLanguageCode={selectedLanguageCode}
    tags={tags}

    on:newTag={onNewTag}
    on:toggleTag={onToggleTag}

    on:save={onSaveClick}
  />
{/if}

{#if showPlayer}
  <Player playerData={playerData}/>
{/if}
