<script lang="ts">
  import {onMount, onDestroy} from 'svelte';
  import { fade } from 'svelte/transition';
  import { cubicInOut } from 'svelte/easing';
  import Display from "./Display.svelte";
  import states from './displayStates';
  import type { AudioFile } from './types';

  const backendUrl = 'https://localhost:5010/static/';

  let audioHtml: HTMLAudioElement;
  let playerHtml: HTMLElement;

  let left: number = 0;
  let top: number = 0;

  export const currentFile: AudioFile = null;

  let initTimeoutHandler: number;

  const attachEvents = () => {
    const video = document.querySelector('video');

    if (video) {
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

  onMount(() => {
    try {
      const stored = localStorage.getItem('AltShiftPlayerLocation');
      const obj = JSON.parse(stored);
      left = obj.left;
      top = obj.top;

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
</script>

<div class="player" bind:this={playerHtml} transition:fade={{delay: 0, duration: 200, easing: cubicInOut}}
     style={`left: ${left}px; top: ${top}px`}
     on:mousedown={onMouseDown}>

  <div class="content">
    <Display
      state={states.MENU}
      data={currentFile}
    />

    <div class="arrow-buttons">
      <div class="arrow-left">
        <i class="fas fa-angle-left"></i>
      </div>

      <div class="arrow-up">
        <i class="fas fa-angle-up"></i>
      </div>

      <div class="arrow-right">
        <i class="fas fa-angle-right"></i>
      </div>

      <div class="arrow-down">
        <i class="fas fa-angle-down"></i>
      </div>

      <div class="ok-button">
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

  {#if currentFile && currentFile.path && currentFile.path.length}
    <audio src={currentFile.path} bind:this={audioHtml}></audio>
  {/if}

</div>

<style>
  audio {
    display: none;
  }

  .player {
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

  .power-button.active i {
    color: #248dc1;
  }

  .settings-button, .back-button, .arrow-buttons, .power-button {
    cursor: pointer;
  }
</style>
