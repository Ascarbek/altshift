<script lang="ts">
  import { onMount, onDestroy, createEventDispatcher } from 'svelte';
  import { fade } from 'svelte/transition';
  import { cubicInOut } from 'svelte/easing';
  import { updateList, uploadBlob } from './api/firebase-app';
  import Display from "./Display.svelte";
  import states from './displayStates';
  import type { AudioFile } from './api/types';
  import { AudioFiles } from './api/svelte-stores';
  import { uploadFile } from './api/firebase-app';
  import Recorder from './Recorder.svelte';

  let stream = null;

  let audioHtml: HTMLAudioElement;
  let playerHtml: HTMLElement;

  let left: number = 0;
  let top: number = 0;

  let uploadProgress: number = 0;

  const dispatch = createEventDispatcher();

  export let videoType: string;
  export let videoId: string;

  /**
   * playback events
   *
  */
  let initTimeoutHandler: number;

  const attachEvents = () => {
    const video = document.querySelector('video');

    if (video && audioHtml) {
      video.addEventListener('pause', pauseHandler);
      video.addEventListener('play', playHandler);
      video.addEventListener('timeupdate', timeHandler);

      if (!video.paused) {
        audioHtml.play()
      }
    } else {
      initTimeoutHandler = setTimeout(attachEvents, 10);
    }
  }

  const pauseHandler = () => {
    audioHtml.pause();
  }

  const playHandler = () => {
    audioHtml.play();
  }

  let busy = false;

  let intervalHandler = setInterval(() => {
    busy = false;
  }, 1000);

  const timeHandler = async (e: any) => {
    if (busy) return
    if (Math.abs(audioHtml.currentTime - e.target.currentTime) < 0.1) return;
    const video = document.querySelector('video');
    if (!video) return;
    audioHtml.currentTime = e.target.currentTime;
    if (!video.paused) {
      audioHtml.play()
    }
    busy = true;
  }

  /**
   * Player movement events
   *
  */
  onMount(() => {
    try {
      const stored = localStorage.getItem('AltShiftPlayerLocation');
      const obj = JSON.parse(stored);
      left = obj.left;
      top = obj.top;

      if(left + 350 > screen.width) {
        left = screen.width - 350 - 20;
      }

      if(top + 64 > screen.height) {
        top = screen.height - 64 - 20;
      }

      setTimeout(attachEvents, 10);
    } catch (e) {

    }
  });

  onDestroy(() => {
    clearInterval(intervalHandler);
    clearTimeout(initTimeoutHandler);
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('mouseup', onMouseUp);
  });

  const onMouseDown = () => {
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  }

  const onMouseUp = () => {
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('mouseup', onMouseUp);
    localStorage.setItem('AltShiftPlayerLocation', JSON.stringify({left, top}));
  }

  const onMouseMove = (e: MouseEvent) => {
    left += e.movementX;
    top += e.movementY;
  }

  /**
   * Menu events
   *
  */

  let currentFile: AudioFile;
  let homeItemIndex: number;
  let menuItemIndex: number;
  let currentState: string;

  const onUpClick = () => {
    if($AudioFiles.length === 0) return;
    if(currentState === states.MENU) {
      currentState = states.HOME;
      return;
    }
    else if(currentState !== states.HOME) {
      return;
    }
    homeItemIndex--;
    if(homeItemIndex < 0) {
      homeItemIndex = $AudioFiles.length - 1;
      currentState = states.MENU;
    }
    currentFile = $AudioFiles[homeItemIndex];
  };

  const onDownClick = () => {
    if($AudioFiles.length === 0) return;
    if(currentState === states.MENU) {
      currentState = states.HOME;
      return;
    }
    else if(currentState !== states.HOME) {
      return;
    }
    homeItemIndex++;
    if(homeItemIndex > $AudioFiles.length - 1) {
      homeItemIndex = 0;
      currentState = states.MENU;
    }
    currentFile = $AudioFiles[homeItemIndex];
  };

  const onLeftClick = () => {
    if(currentState === states.MENU) {
      menuItemIndex--;
      if(menuItemIndex < 0) {
        menuItemIndex = 1;
      }
    }
  }

  const onRightClick = () => {
    if(currentState === states.MENU) {
      menuItemIndex++;
      if(menuItemIndex > 1) {
        menuItemIndex = 0;
      }
    }
  }

  const onOkClick = async () => {
    if(currentState === states.MENU) {
      if(menuItemIndex === 1) {
        uploadClick();
      }
      if(menuItemIndex === 0) {
        currentState = states.RECORDER;
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      }
    }
  }

  const setDisplayState = (files: AudioFile[]) => {
    if(files.length === 0) {
      currentState = states.MENU;
    }
    else {
      currentState = states.HOME;
      homeItemIndex = 0;
      currentFile = files[homeItemIndex];
    }
  }

  $: setDisplayState($AudioFiles);

  /**
   * Upload Audio file events
   *
  */
  const uploadClick = () => {
    document.getElementById('upload-input').dispatchEvent(new MouseEvent('click'));
    document.getElementById('upload-input').addEventListener('change', onFileSelect);
  }

  const onFileSelect = async (e) => {
    currentState = states.UPLOAD_PROGRESS;
    document.getElementById('upload-input').removeEventListener('change', onFileSelect);
    uploadProgress = 0;

    const files = e.target.files;
    const file = files[0];

    uploadFile(videoType, `${videoId}/${file.name}`, file, (p) => {
      uploadProgress = p;
    }, (path) => {
      currentState = states.HOME;
      updateList(videoType, videoId);
    });
  }

  const onDataAvailable = async(e) => {
    uploadBlob(videoType, `${videoId}/newRecording.webm`, e.detail, () => {

    }, () => {

    });
  }
</script>

<div class="player" bind:this={playerHtml} transition:fade={{delay: 0, duration: 200, easing: cubicInOut}}
     style={`left: ${left}px; top: ${top}px`}
     on:mousedown={onMouseDown}>

  <div class="content">
    <Display
      state={currentState}
      data={currentFile}
      on:uploadClick={uploadClick}
      bind:progress={uploadProgress}
      bind:menuItemIndex={menuItemIndex}
    >
      <div slot="recorder">
        <Recorder bind:stream={stream} on:onDataAvailable={onDataAvailable}>

        </Recorder>
      </div>
    </Display>

    <div class="arrow-buttons">
      <div class="arrow-left" on:click={onLeftClick}>
        <i class="fas fa-angle-left"></i>
      </div>

      <div class="arrow-up" on:click={onUpClick}>
        <i class="fas fa-angle-up"></i>
      </div>

      <div class="arrow-right" on:click={onRightClick}>
        <i class="fas fa-angle-right"></i>
      </div>

      <div class="arrow-down" on:click={onDownClick}>
        <i class="fas fa-angle-down"></i>
      </div>

      <div class="ok-button" on:click={onOkClick}>
        <span>OK</span>
      </div>
    </div>

    <div class="settings-button">
      <span>menu</span>
    </div>

    <div class="back-button">
      <span>back</span>
    </div>

    <div class="power-button">
      <i class="fas fa-power-off"></i>
    </div>
  </div>

  {#if currentFile}
    <audio src={currentFile.path} bind:this={audioHtml}></audio>
  {/if}

</div>

<style>
  audio {
    display: none;
  }

  .player {
    user-select: none;

    position: fixed;
    z-index: 10000;

    left: 20px;
    top: 80px;

    background: #ffffff;
    width: 350px;
    height: 64px;

    border-radius: 4px;
    box-shadow: 0 0 3px 0 #000000;
  }

  .content {
    position: relative;
    height: 100%;
  }

  .arrow-buttons {
    position: absolute;
    right: 35px;
    top: 8px;
    line-height: 14px;
    height: calc(100% - 14px);
    width: 50px;
  }

  .arrow-left, .arrow-right, .arrow-up, .arrow-down, .ok-button {
    position: absolute;
    color: #9e9e9e;
    font-size: 16px;
    padding: 3px;
  }

  .arrow-left:hover, .arrow-right:hover, .arrow-up:hover, .arrow-down:hover, .ok-button:hover {
    color: #000000;
  }

  .arrow-left {
    left: 0;
    top: calc(50% - 11px);
  }

  .arrow-right {
    right: 0;
    top: calc(50% - 11px);
  }

  .arrow-down {
    bottom: -3px;
    left: calc(50% - 8px);
  }

  .arrow-up {
    top: -3px;
    left: calc(50% - 8px);
  }

  .ok-button, .settings-button, .back-button, .power-button {
    position: absolute;
    color: #9e9e9e;
    font-family: 'Roboto Mono', monospace;
    font-size: 11px;
  }

  .ok-button:hover, .settings-button:hover, .back-button:hover {
    color: #000000;
  }

  .ok-button {
    top: calc(50% - 10px);
    left: calc(50% - 9px);
  }

  .settings-button {
    right: 8px;
    bottom: 2px;
  }

  .back-button {
    right: 8px;
    top: 2px;
  }

  .power-button {
    left: 10px;
    top: 22px;
    line-height: 14px;
    padding: 4px;
    font-size: 16px;
  }

  /*
  .power-button.active i {
    color: #248dc1;
  }
  */

  .settings-button, .back-button, .arrow-buttons, .power-button {
    cursor: pointer;
  }
</style>
