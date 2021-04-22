<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import { fade } from 'svelte/transition';
  import { cubicInOut } from 'svelte/easing';

  import type { IAudioFile } from './api/types';
  import { DisplayStates, RecordingStates } from './api/types';
  import { AudioFiles, currentUser, ProjectId, showLogo } from './api/svelte-stores';

  import Display from './Display.svelte';
  import Recorder from './Recorder.svelte';
  import RecordingTracks from './RecordingTracks.svelte';
  import { getAudioFiles, mixProject } from './api/backend';

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

  const resetOnVideoChange = (id: string) => {
    homeItemIndex = 0;
    currentState = DisplayStates.MENU;
    renderPlayer = false;
  };

  $: resetOnVideoChange(videoId);

  /**
   * Playback events
   * */
  let initTimeoutHandler1: any;
  let initTimeoutHandler2: any;
  let isPlaying = false;

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
    wakeUp();
    isPlaying = false;
    canPlay = false;
    audioHtml?.pause();
  };

  const canPlayHandler = (e) => {
    canPlay = true;
    if (e.target.duration) {
      duration = e.target.duration;
    }
  };

  const playHandler = (e) => {
    canPlay = audioHtml?.readyState === 4;
    if (e.target.duration) {
      duration = e.target.duration;
    }
    if (canPlay) {
      audioHtml?.play();
    }
  };

  const timeHandler = async (e: any) => {
    hideAfterTimeout();
    const video = e.target;
    currentTime = video.currentTime;
    isPlaying = true;
    duration = video.duration;
    if (busy) return;
    if (audioHtml) {
      if (Math.abs(audioHtml.currentTime - video.currentTime) < 0.1) return;
      audioHtml.currentTime = video.currentTime;
      if (!video.paused) {
        await audioHtml.play();
        if (renderPlayer) {
          video.volume = 0.3;
        }
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
    } catch (e) {}
  });

  onDestroy(() => {
    renderPlayer = false;
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
    wakeUp();
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
      if (!$currentUser?.uid) {
        onShowSignIn();
        return;
      }

      if (menuItemIndex === 1) {
        uploadClick();
      }
      if (menuItemIndex === 0) {
        currentState = DisplayStates.RECORDER;
        AudioInputStreamPromise = navigator.mediaDevices.getUserMedia({ audio: true });
        recordingState = RecordingStates.ALLOW_MESSAGE;
      }
    }

    if (currentState === DisplayStates.RECORDER) {
      if (recordingState === RecordingStates.PAUSE_MESSAGE || recordingState === RecordingStates.FIRST_MESSAGE) {
        currentState = DisplayStates.UPLOAD_PROGRESS;
        uploadProgress = 0;
        const int = setInterval(() => {
          uploadProgress += 10;
          if (uploadProgress > 60) {
            clearInterval(int);
          }
        }, 1000);

        await mixProject($ProjectId);

        clearInterval(int);
        currentState = DisplayStates.MENU;
        const files = await getAudioFiles(videoType, videoId);
        $AudioFiles = files.map<IAudioFile>((item) => ({
          name: item.name,
          path: item.path,
          tags: item.tags,
          lang: item.lang,
        }));
      }
    }
  };

  const onBackClick = () => {
    currentState = DisplayStates.MENU;
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

    /*   uploadBlob(`${videoId}/${file.name}`, file, (p) => {
         uploadProgress = p;
       }, () => {
         currentState = DisplayStates.HOME;
         updateList(videoType, videoId, $supabase);
       });*/
  };

  export let onShowSignIn: () => void;

  let showUI = true;
  let hideTimeoutHandler;
  let hiding = false;

  const hideAfterTimeout = () => {
    if (hiding) return;
    if (currentState === DisplayStates.RECORDER) return;
    hiding = true;
    hideTimeoutHandler = setTimeout(() => {
      showUI = false;
    }, 3000);
  };

  const wakeUp = () => {
    clearTimeout(hideTimeoutHandler);
    showUI = true;
    hiding = false;
  };
</script>

{#if showUI}
  <div
    class="player"
    bind:this="{playerHtml}"
    in:fade="{{ delay: 0, duration: 300, easing: cubicInOut }}"
    out:fade="{{ delay: 0, duration: 1500, easing: cubicInOut }}"
    style="{`left: ${left}px; top: ${top}px`}"
    on:mousedown="{onMouseDown}"
  >
    <div class="content">
      <Display
        state="{currentState}"
        data="{currentFile}"
        on:uploadClick="{uploadClick}"
        bind:progress="{uploadProgress}"
        bind:menuItemIndex
      >
        <div slot="recorder">
          <Recorder
            streamPromise="{AudioInputStreamPromise}"
            videoType="{videoType}"
            videoId="{videoId}"
            duration="{duration}"
            projectName="{$currentUser.defaultProjectName}"
            voiceName="male 1"
            bind:currentState="{recordingState}"
          />
        </div>
      </Display>

      <div class="arrow-buttons">
        <div class="arrow-left" on:click="{onLeftClick}">
          <i class="fas fa-angle-left"></i>
        </div>

        <div class="arrow-up" on:click="{onUpClick}">
          <i class="fas fa-angle-up"></i>
        </div>

        <div class="arrow-right" on:click="{onRightClick}">
          <i class="fas fa-angle-right"></i>
        </div>

        <div class="arrow-down" on:click="{onDownClick}">
          <i class="fas fa-angle-down"></i>
        </div>

        <div class="ok-button" on:click="{onOkClick}">
          <span>OK</span>
        </div>
      </div>

      <div class="settings-button">
        <span>menu</span>
      </div>

      <div class="back-button" on:click="{onBackClick}">
        <span>back</span>
      </div>

      <div class="power-button" class:playing="{isPlaying}" class:recording="{currentState === DisplayStates.RECORDER}">
        <i class="fas fa-power-off"></i>
      </div>
    </div>
  </div>
{/if}

{#if renderPlayer}
  <audio src="{currentFile.path}" bind:this="{audioHtml}"></audio>
{/if}
{#if currentState === DisplayStates.RECORDER && recordingState !== RecordingStates.LOADING}
  <RecordingTracks currentTime="{currentTime}" duration="{duration}" on:seek="{onRecordingTrackSeek}" />
{/if}

<svelte:window on:mousemove="{wakeUp}" />

<style>
  audio {
    display: none;
  }

  .player {
    user-select: none;

    position: fixed;
    z-index: 11000;

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

  .arrow-left,
  .arrow-right,
  .arrow-up,
  .arrow-down,
  .ok-button {
    position: absolute;
    color: #9e9e9e;
    font-size: 16px;
    padding: 3px;
  }

  .arrow-left:hover,
  .arrow-right:hover,
  .arrow-up:hover,
  .arrow-down:hover,
  .ok-button:hover {
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

  .ok-button,
  .settings-button,
  .back-button,
  .power-button {
    position: absolute;
    color: #9e9e9e;
    font-family: 'Roboto Mono', monospace;
    font-size: 11px;
  }

  .ok-button:hover,
  .settings-button:hover,
  .back-button:hover {
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

  .settings-button,
  .back-button,
  .arrow-buttons,
  .power-button {
    cursor: pointer;
  }

  .power-button.playing {
    color: #3b82f6;
  }

  .power-button.recording {
    color: #ef4444;
  }
</style>
