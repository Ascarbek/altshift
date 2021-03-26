<script lang='ts'>
  import { onDestroy, onMount } from 'svelte';
  import { fade } from 'svelte/transition';
  import { cubicInOut } from 'svelte/easing';

  import { DEFAULT_USER_ID, renameProject, updateList, uploadBlob } from './api/firebase-app';
  import type { IAudioFile } from './api/types';
  import { DisplayStates, RecordingStates } from './api/types';
  import { AudioFiles, currentUser, ProjectId, showLogo } from './api/svelte-stores';

  import Display from './Display.svelte';
  import Recorder from './Recorder.svelte';
  import RecordingTracks from './RecordingTracks.svelte';
  import { processProject } from './api/mixer-app';

  let AudioInputStreamPromise: Promise<MediaStream> = null;

  let audioHtml: HTMLAudioElement;
  let playerHtml: HTMLElement;

  let currentTime: number = 0;
  let duration: number = -1;

  let left: number = 0;
  let top: number = 0;

  let uploadProgress: number = 0;

  export let videoType: string;
  export let videoId: string;

  let canPlay: boolean = false;

  let renderPlayer = false;

  /**
   * Playback events
   * */
  let initTimeoutHandler1: any;
  let initTimeoutHandler2: any;

  const attachVideoEvents = () => {
    const video = document.querySelector('video');

    if (video) {
      video.addEventListener('timeupdate', timeHandler);
      video.addEventListener('canplay', canPlayHandler);
    } else {
      initTimeoutHandler1 = setTimeout(attachVideoEvents, 10);
    }
  };

  const attachAudioEvents = () => {
    const video = document.querySelector('video');

    if (video) {
      if (audioHtml) {
        video.addEventListener('pause', pauseHandler);
        video.addEventListener('play', playHandler);

        if (!video.paused) {
          audioHtml.play();
        }
      }
    } else {
      initTimeoutHandler2 = setTimeout(attachAudioEvents, 10);
    }
  };

  const pauseHandler = () => {
    canPlay = false;
    audioHtml?.pause();
  };

  const canPlayHandler = (e) => {
    canPlay = true;
    if (e.target.duration && duration < 0) {
      duration = e.target.duration;
    }
  };

  const playHandler = () => {
    canPlay = audioHtml?.readyState === 4;
    if (canPlay) {
      audioHtml?.play();
    }
  };

  const timeHandler = async (e: any) => {
    const video = e.target;
    currentTime = video.currentTime;
    if (busy) return;
    if (audioHtml) {
      if (Math.abs(audioHtml.currentTime - video.currentTime) < 0.1) return;
      audioHtml.currentTime = video.currentTime;
      if (!video.paused) {
        await audioHtml.play();
      }
    }
    busy = true;
  };

  /**
   * Recording track Events
   * */
  const onRecordingTrackSeek = (e) => {
    const video = document.querySelector('video');
    video.currentTime = e.detail.time;
  };

  /**
   * Fix for too frequent timeHandler call
   * */
  let busy: boolean = false;

  let intervalHandler: any = setInterval(() => {
    busy = false;
  }, 1000);

  /**
   * Player movement events
   * */
  onMount(() => {
    try {
      const stored = localStorage.getItem('AltShiftPlayerLocation');
      const obj = JSON.parse(stored);
      left = obj.left;
      top = obj.top;

      if (left + 350 > screen.width) {
        left = screen.width - 350 - 20;
      }

      if (top + 64 > screen.height) {
        top = screen.height - 64 - 20;
      }

      setTimeout(attachVideoEvents, 10);
    } catch (e) {

    }
  });

  onDestroy(() => {
    clearInterval(intervalHandler);
    clearTimeout(initTimeoutHandler1);
    clearTimeout(initTimeoutHandler2);
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('mouseup', onMouseUp);
  });

  const onMouseDown = () => {
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  const onMouseUp = () => {
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('mouseup', onMouseUp);
    localStorage.setItem('AltShiftPlayerLocation', JSON.stringify({ left, top }));
  };

  const onMouseMove = (e: MouseEvent) => {
    left += e.movementX;
    top += e.movementY;
  };

  /**
   * Menu events
   * */
  let currentFile: IAudioFile;
  let homeItemIndex: number;
  let menuItemIndex: number;
  let currentState: DisplayStates = DisplayStates.MENU;
  let recordingState: RecordingStates;

  const onUpClick = () => {
    if ($AudioFiles.length === 0) return;
    if (currentState === DisplayStates.MENU) {
      currentState = DisplayStates.HOME;
      renderPlayer = true;
      return;
    } else if (currentState !== DisplayStates.HOME) {
      return;
    }
    homeItemIndex--;
    if (homeItemIndex < 0) {
      homeItemIndex = $AudioFiles.length - 1;
      currentState = DisplayStates.MENU;
      renderPlayer = false;
    }
    currentFile = $AudioFiles[homeItemIndex];
  };

  const onDownClick = () => {
    if ($AudioFiles.length === 0) return;
    if (currentState === DisplayStates.MENU) {
      currentState = DisplayStates.HOME;
      renderPlayer = true;
      return;
    } else if (currentState !== DisplayStates.HOME) {
      return;
    }
    homeItemIndex++;
    if (homeItemIndex > $AudioFiles.length - 1) {
      homeItemIndex = 0;
      currentState = DisplayStates.MENU;
      renderPlayer = false;
    }
    currentFile = $AudioFiles[homeItemIndex];
  };

  const onLeftClick = () => {
    if (currentState === DisplayStates.MENU) {
      menuItemIndex--;
      if (menuItemIndex < 0) {
        menuItemIndex = 1;
      }
    }
  };

  const onRightClick = () => {
    if (currentState === DisplayStates.MENU) {
      menuItemIndex++;
      if (menuItemIndex > 1) {
        menuItemIndex = 0;
      }
    }
  };

  const onOkClick = async () => {
    if (currentState === DisplayStates.MENU) {
      if (menuItemIndex === 1) {
        if ($currentUser?.uid === DEFAULT_USER_ID) {
          onShowSignIn();
          return;
        }
        uploadClick();
      }
      if (menuItemIndex === 0) {
        if ($currentUser?.uid === DEFAULT_USER_ID) {
          onShowSignIn();
          return;
        }

        currentState = DisplayStates.RECORDER;
        AudioInputStreamPromise = navigator.mediaDevices.getUserMedia({ audio: true });
        recordingState = RecordingStates.ALLOW_MESSAGE;
      }
    }

    if (currentState === DisplayStates.RECORDER) {
      if (recordingState === RecordingStates.PAUSE_MESSAGE) {
        currentState = DisplayStates.UPLOAD_PROGRESS;
        uploadProgress = 0;
        const int = setInterval(() => {
          uploadProgress += 10;
          if (uploadProgress > 60) {
            clearInterval(int);
          }
        }, 1000);
        await processProject($ProjectId);
        currentState = DisplayStates.MENU;
      }
    }
  };

  const setDisplayState = (showLogo: boolean, files: IAudioFile[]) => {
    if (showLogo) {
      currentState = DisplayStates.LOGO;
      return;
    }

    if (files.length === 0) {
      currentState = DisplayStates.MENU;
    } else {
      currentState = DisplayStates.HOME;
      homeItemIndex = 0;
      currentFile = files[homeItemIndex];
      renderPlayer = true;
      setTimeout(attachAudioEvents, 10);
    }
  };

  $: setDisplayState($showLogo, $AudioFiles);

  /**
   * Upload Audio file events
   * */
  const uploadClick = () => {
    document.getElementById('upload-input').dispatchEvent(new MouseEvent('click'));
    document.getElementById('upload-input').addEventListener('change', onFileSelect);
  };

  const onFileSelect = async (e) => {
    currentState = DisplayStates.UPLOAD_PROGRESS;
    document.getElementById('upload-input').removeEventListener('change', onFileSelect);
    uploadProgress = 0;

    const files = e.target.files;
    const file = files[0];

    uploadBlob(`${videoId}/${file.name}`, file, (p) => {
      uploadProgress = p;
    }, () => {
      currentState = DisplayStates.HOME;
      updateList(videoType, videoId);
    });
  };

  export let onShowSignIn: () => void;
</script>

<div class='player' bind:this={playerHtml} transition:fade={{delay: 0, duration: 200, easing: cubicInOut}}
     style={`left: ${left}px; top: ${top}px`}
     on:mousedown={onMouseDown}>

  <div class='content'>
    <Display
      state={currentState}
      data={currentFile}
      on:uploadClick={uploadClick}
      bind:progress={uploadProgress}
      bind:menuItemIndex={menuItemIndex}
    >
      <div slot='recorder'>
        <Recorder
          streamPromise={AudioInputStreamPromise}
          videoType={videoType}
          videoId={videoId}
          duration={duration}
          projectName='project one'
          voiceName='male 1'
          bind:currentState={recordingState}
        >
        </Recorder>
      </div>
    </Display>

    <div class='arrow-buttons'>
      <div class='arrow-left' on:click={onLeftClick}>
        <i class='fas fa-angle-left'></i>
      </div>

      <div class='arrow-up' on:click={onUpClick}>
        <i class='fas fa-angle-up'></i>
      </div>

      <div class='arrow-right' on:click={onRightClick}>
        <i class='fas fa-angle-right'></i>
      </div>

      <div class='arrow-down' on:click={onDownClick}>
        <i class='fas fa-angle-down'></i>
      </div>

      <div class='ok-button' on:click={onOkClick}>
        <span>OK</span>
      </div>
    </div>

    <div class='settings-button'>
      <span>menu</span>
    </div>

    <div class='back-button'>
      <span>back</span>
    </div>

    <div class='power-button'>
      <i class='fas fa-power-off'></i>
    </div>
  </div>

  {#if renderPlayer}
    <audio src='{currentFile.path}' bind:this={audioHtml}></audio>
  {/if}

</div>

{#if currentState === DisplayStates.RECORDER}
  <RecordingTracks
    currentTime={currentTime}
    duration={duration}
    on:seek={onRecordingTrackSeek}
    onProjectNameChange={(v) => renameProject($ProjectId, v)}
  >
  </RecordingTracks>
{/if}

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
