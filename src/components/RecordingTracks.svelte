<script lang='ts'>
  import { createEventDispatcher, onDestroy, onMount } from 'svelte';
  import { ProjectName, Voices, CurrentParts, ProjectId } from './api/svelte-stores';
  import { deleteRecording, getRecordings } from './api/firebase-app';
  import { compressPeaks, getFormatted } from './api/waveHelpers';

  const dispatch = createEventDispatcher();

  export let currentTime: number;
  export let duration: number;

  export let onProjectNameChange: (v: string) => void;

  const onDeleteClick = async () => {
    for (const id of selectedParts) {
      await deleteRecording(id);
    }
    selectedParts = [];

    $CurrentParts = await getRecordings($ProjectId);
  };

  let canvasElement: HTMLCanvasElement;
  let outer;

  $: currentTime && render();
  $: duration && render();
  $: scale && render();
  $: $CurrentParts && render();
  $: selectedParts && render();
  $: scrollOffset && render();

  $: console.log(duration);

  const fullHeight = 110;
  const paddingTop = 10;
  const paddingBottom = 20;
  const paddingLeft = 5;
  const paddingRight = 5;
  const trackHeight = 40;
  const cursorWidth = 2;
  const cursorRadius = 3;
  const timeMainNotchHeight = 5;

  const barHeight = 13;
  const barCenter = paddingTop + trackHeight + paddingTop + timeMainNotchHeight + 25 + barHeight / 2;
  const barTop = paddingTop + trackHeight + paddingTop + timeMainNotchHeight + 25;

  let scale = 2;

  let selectedParts: string[] = [];

  function render() {
    if (!canvasElement) return;

    canvasElement.width = outer.clientWidth;
    canvasElement.height = outer.clientHeight;
    const ctx = canvasElement.getContext('2d');

    // BG
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, outer.clientWidth, fullHeight);

    // scrollbar
    const barWidth = outer.clientWidth / 2;
    if (scrollOffset < 0)
      actualScrollOffset = 0;
    else if (scrollOffset > outer.clientWidth - paddingLeft - paddingRight - barWidth)
      actualScrollOffset = outer.clientWidth - paddingLeft - paddingRight - barWidth;
    else actualScrollOffset = scrollOffset;

    ctx.fillStyle = '#e5e5e5';
    ctx.fillRect(paddingLeft + barHeight / 2 + actualScrollOffset, barTop, barWidth - barHeight, barHeight);
    ctx.beginPath();
    ctx.arc(paddingLeft + barHeight / 2 + actualScrollOffset, barCenter, barHeight / 2, 0, Math.PI * 2);
    ctx.arc(paddingLeft + barWidth - barHeight / 2 + actualScrollOffset, barCenter, barHeight / 2, 0, Math.PI * 2);
    ctx.fill();

    scrollPercent = actualScrollOffset / (outer.clientWidth - paddingLeft - paddingRight - barWidth);
    scrollSeconds = (duration - (outer.clientWidth - paddingLeft - paddingRight) / scale) * scrollPercent;

    // Track
    ctx.fillStyle = '#f3f3f3';
    ctx.fillRect(paddingLeft, paddingTop, outer.clientWidth - paddingLeft - paddingRight, trackHeight);

    // center line
    ctx.fillStyle = '#e0e0e0';
    ctx.fillRect(paddingLeft, paddingTop + trackHeight / 2, outer.clientWidth - paddingLeft - paddingRight, 1);

    // minutes
    let step = 0;
    let small = 0;

    // every 60
    if (scale <= 2) {
      step = 60;
      small = 15;
    }

    // every 30
    if (scale > 2 && scale <= 4) {
      step = 30;
      small = 10;
    }

    // every 15
    if (scale > 4 && scale <= 6) {
      step = 15;
      small = 5;
    }

    // with small
    if (scale > 6) {
      step = 15;
      small = 1;
    }

    for (let i = 0; i < Math.round(duration / step) + 1; i++) {
      ctx.fillStyle = '#4c4c4c';
      if (i * step - scrollSeconds >= 0) {
        ctx.fillRect(paddingLeft + (i * step - scrollSeconds) * scale, paddingTop + trackHeight + paddingTop, 1, timeMainNotchHeight);
        ctx.fillText(getFormatted(i * step), paddingLeft + (i * step - scrollSeconds) * scale, paddingTop + trackHeight + paddingTop + timeMainNotchHeight + 8 + 3);
      }

      for (let j = 1; j < step / small; j++) {
        ctx.fillStyle = '#ababab';
        if (i * step + j * small - scrollSeconds >= 0) {
          ctx.fillRect(paddingLeft + (i * step + j * small - scrollSeconds) * scale, paddingTop + trackHeight + paddingTop + 1, 1, timeMainNotchHeight - 1);
        }
      }
    }

    // audio tracks
    for (const part of $CurrentParts) {
      if (selectedParts.includes(part.id)) {
        ctx.fillStyle = '#248093';
      } else {
        ctx.fillStyle = '#000000';
      }
      if (part.start - scrollSeconds >= 0) {
        ctx.fillRect(paddingLeft + (part.start - scrollSeconds) * scale, paddingTop, (part.end - part.start) * scale, trackHeight);
      } else if (part.end - scrollSeconds >= 0) {
        ctx.fillRect(paddingLeft, paddingTop, (part.end - scrollSeconds) * scale, trackHeight);
      }

      const peakLines = compressPeaks(part.peaks, (part.end - part.start) * scale / 2);

      for (let i = 0; i < peakLines.length; i++) {
        ctx.fillStyle = '#e5e5e5';
        const peak = peakLines[i];
        if (part.start + (i * 2) / scale - scrollSeconds >= 0) {
          ctx.fillRect(paddingLeft + (part.start - scrollSeconds) * scale + i * 2, paddingTop + trackHeight / 2 - (peak - 1) * trackHeight / 2, 1, (peak - 1) * trackHeight + 1);
        }
      }
    }

    // cursor
    ctx.fillStyle = '#be2a2c';
    if (currentTime - scrollSeconds >= 0) {
      ctx.fillRect(paddingLeft + (currentTime - scrollSeconds) * scale, paddingTop / 2, cursorWidth, trackHeight + paddingTop);
      ctx.beginPath();
      ctx.arc(paddingLeft + (currentTime - scrollSeconds) * scale + cursorWidth / 2, paddingTop / 2, cursorRadius, 0, Math.PI * 2);
      ctx.arc(paddingLeft + (currentTime - scrollSeconds) * scale + cursorWidth / 2, trackHeight + paddingTop + paddingTop / 2, cursorRadius, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  let seeking = false;
  let scrolling = false;
  let scrollOffset = 0;
  let actualScrollOffset = 0;
  let scrollPercent = 0;
  let scrollSeconds = 0;

  const onCanvasDown = (e: MouseEvent) => {
    if (e.offsetY > paddingTop && e.offsetY < paddingTop + trackHeight) {
      let hasSelected = false;
      for (const part of $CurrentParts) {
        if (e.clientX >= paddingLeft + (part.start - scrollSeconds) * scale && e.clientX <= paddingLeft + (part.start - scrollSeconds) * scale + (part.end - part.start) * scale) {
          if (e.shiftKey) {
            selectedParts = [...selectedParts, part.id];
          } else {
            selectedParts = [part.id];
          }
          hasSelected = true;
        }
      }
      if (!hasSelected) selectedParts = [];
    }
    if (!seeking && e.offsetY > paddingTop + trackHeight && e.offsetY < barTop) {
      seeking = true;
      const x = e.offsetX - paddingLeft;
      dispatch('seek', { time: (scrollSeconds + x / scale) });
      currentTime = (scrollSeconds + x / scale);
    }
    if (!scrolling && e.offsetY > barTop) {
      scrolling = true;
    }
  };

  const onCanvasMove = (e: MouseEvent) => {
    if (seeking) {
      seeking = true;
      const x = e.offsetX - paddingLeft;
      dispatch('seek', { time: (scrollSeconds + x / scale) });
      currentTime = (scrollSeconds + x / scale);
    }

    if (scrolling) {
      scrollOffset += e.movementX;
    }

    if (e.offsetY > barTop) {
      // hover effect
    }
  };

  const onCanvasUp = (e: MouseEvent) => {
    seeking = false;
    scrolling = false;
    scrollOffset = actualScrollOffset;
  };
</script>


<!--<div class='project-name'>
  <input bind:value={$ProjectName} on:blur={(e) => onProjectNameChange(e.target.value)}>
</div>-->

<div class='toolbar'>
  <input class='project-name' bind:value={$ProjectName} on:blur={(e) => onProjectNameChange(e.target.value)}>
  <button on:click={() => scale++}>
    <i class='fas fa-search-plus'></i>
  </button>
  <button on:click={() => {if(scale > 1) scale--}}>
    <i class='fas fa-search-minus'></i>
  </button>
  <button on:click={() => onDeleteClick()}>
    <i class='far fa-trash-alt'></i>
  </button>
  <div>
    {getFormatted(currentTime, true)}
  </div>
</div>

{#each $Voices as voice}
  <div class='track-outer' bind:this={outer} style={`height: ${fullHeight}px`}>
    <canvas bind:this={canvasElement} on:mousedown={onCanvasDown} on:mousemove={onCanvasMove}
            on:mouseup={onCanvasUp}></canvas>
  </div>
{/each}

<style>
  .track-outer {
    user-select: none;
    position: fixed;
    z-index: 10000;
    left: 0;
    top: calc(10px + 40px);
    width: 100vw;
    box-shadow: 0 0 3px 0 #000000;
  }

  .toolbar {
    position: fixed;
    z-index: 10000;
    left: 10px;
    top: 5px;
    width: 800px;
    padding: 7px;
    background: #ffffff;
    display: flex;
    align-items: center;
  }

  button {
    margin-right: 10px;
  }

  input {
    font-family: 'Roboto Mono', monospace;
    font-weight: bold;
    background: none;
    border: none;
    outline: none;
    padding-bottom: 5px;
  }

  .project-name {
    margin-right: 10px;
    width: 300px;
  }

  input:focus {
    border-bottom: 1px solid #000000;
  }
</style>
