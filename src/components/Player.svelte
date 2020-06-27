<script>
  import { createEventDispatcher, tick, onDestroy } from 'svelte';
  import { fade } from 'svelte/transition';

  const dispatch = createEventDispatcher();

  const backendUrl = 'https://localhost:5010/static/';
  let currentTime = 0;
  let paused = false;
  let audioHtml;
  let playerHtml;

  let left = 0;
  let top = 0;

  export let fileName = '';
  export let audioName = '';

  const init = f => {
    let handler = setInterval(() => {
      if(document.querySelector('video')) {
        clearInterval(handler);

        const video = document.querySelector('video');

        video.addEventListener('pause', pauseHandler);
        video.addEventListener('play', playHandler);
        video.addEventListener('timeupdate', timeHandler);

        audioHtml.play();
      }
    }, 100);
  }

  $: fileName && fileName.length > 0 ? init(fileName) : '';

  const pauseHandler = e => {
    paused = true;
  }

  const playHandler = e => {
    paused = false;
  }

  let busy = false;

  let intervalHandler = setInterval(() => {
    busy = false;
  }, 1000);

  onDestroy(() => {
    clearInterval(intervalHandler);
  });

  const timeHandler = async e => {
    if(busy) return
    if(Math.abs(currentTime - e.target.currentTime) < 0.1) return;
    const video = document.querySelector('video');
    if(!video) return;
    currentTime = e.target.currentTime;
    paused = video.paused;
    console.log('time updated');
    busy = true;
  }

  const onMouseDown = e => {
    playerHtml.addEventListener('mousemove', onMouseMove);
  }

  const onMouseUp = e => {
    playerHtml.removeEventListener('mousemove', onMouseMove);
  }

  const onMouseMove = e => {
    left += e.movementX;
    top += e.movementY;
  }
</script>

<div class="player" transition:fade style="left: {left}px; top: {top}px" on:mousedown={onMouseDown} on:mouseup={onMouseUp} bind:this={playerHtml}>
  <div class="content">
    <div class="display-outer">
      <div class="display">
        {audioName}
      </div>
    </div>

    <div class="arrow-buttons">
      <div class="arrow-left">
        <i class="fas fa-angle-left"></i>
      </div>

      <div class="arrow-up" on:click={e => dispatch('downClick')}>
        <i class="fas fa-angle-up"></i>
      </div>

      <div class="arrow-right">
        <i class="fas fa-angle-right"></i>
      </div>

      <div class="arrow-down" on:click={e => dispatch('downClick')}>
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

  {#if fileName && fileName.length}
    <audio src={backendUrl + fileName}
       bind:paused={paused}
       bind:currentTime={currentTime}
       bind:this={audioHtml}>
    </audio>
  {/if}

</div>

<style>
  audio {
    display: none;
  }
  .fas, .far {
    color: #9e9e9e;
    font-size: 16px;
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

  .display-outer {
    position: absolute;
    top: 10px;
    left: 45px;
    right: 90px;
    height: calc(100% - 20px);
    background: #f0f0f0;
    border: #e0e0e0 1px solid;
    border-radius: 4px;
  }

  .display {
    position: absolute;
    top: 3px;
    left: 3px;
    right: 3px;
    height: calc(100% - 6px);
    background: #beceb2;
    border-radius: 4px;
    color: #464c4b;
    font-family: 'Roboto Mono', monospace;
    display: flex;
    align-items: center;
    font-size: 12px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: clip;
  }

  .arrow-buttons {
    position: absolute;
    right: 28px;
    top: 8px;
    line-height: 14px;
    height: calc(100% - 14px);
    width: 44px;
  }

  .arrow-left, .arrow-right, .arrow-up, .arrow-down, .ok-button {
    position: absolute;
  }

  .arrow-left {
    left: 0;
    top: calc(50% - 8px);
  }

  .arrow-right {
    right: 0;
    top: calc(50% - 8px);
  }

  .arrow-down {
    bottom: 0;
    left: calc(50% - 5px);
  }

  .arrow-up {
    top: 0;
    left: calc(50% - 5px);
  }

  .ok-button {
    top: calc(50% - 6px);
    left: calc(50% - 6px);
    color: #9e9e9e;
    font-family: 'Roboto Mono', monospace;
    font-size: 10px;
  }

  .settings-button {
    position: absolute;
    right: 8px;
    bottom: 2px;
    color: #9e9e9e;
    font-family: 'Roboto Mono', monospace;
    font-size: 10px;
  }

  .back-button {
    position: absolute;
    right: 8px;
    top: 2px;
    color: #9e9e9e;
    font-family: 'Roboto Mono', monospace;
    font-size: 10px;
  }

  .power-button {
    position: absolute;
    left: 10px;
    top: 22px;
    line-height: 14px;
    padding: 4px;
  }

  .power-button.active i {
    color: #248dc1;
  }

  .settings-button, .back-button, .arrow-buttons, .power-button {
    cursor: pointer;
  }
</style>
