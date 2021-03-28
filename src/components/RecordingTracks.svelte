<script lang='ts'>
  import { createEventDispatcher, onDestroy, onMount } from 'svelte';
  import { ProjectName, Voices, CurrentParts, ProjectId } from './api/svelte-stores';
  import { deleteRecording, getRecordings } from './api/firebase-app';
  import { compressPeaks, getFormatted } from './api/waveHelpers';

  const dispatch = createEventDispatcher();

  export let currentTime: number;
  export let duration: number;

  let trackEl;

  const onMouseDown = (e) => {
    const width = trackEl.clientWidth;
    const x = e.pageX - 14;
    const time = duration * (x / width);
    dispatch('seek', { time });
    currentTime = time;
  };

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

  /*let handler;
  onMount(() => {
    handler = setInterval(render, 100);
  });
  onDestroy(() => {
    clearInterval(handler);
  });*/

  $: currentTime && render();
  $: duration && render();
  $: scale && render();
  $: $CurrentParts && render();
  $: selectedParts && render();

  $: console.log($CurrentParts);

  const fullHeight = 90;
  const paddingTop = 10;
  const paddingBottom = 20;
  const paddingLeft = 5;
  const paddingRight = 5;
  const trackHeight = 40;
  const cursorWidth = 2;
  const cursorRadius = 3;
  const timeMainNotchHeight = 5;
  let scale = 2;

  let selectedParts: string[] = [];

  const render = () => {
    if (!canvasElement) return;

    canvasElement.width = outer.clientWidth;
    canvasElement.height = outer.clientHeight;
    const ctx = canvasElement.getContext('2d');

    // BG
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, outer.clientWidth, fullHeight);

    // Track
    ctx.fillStyle = '#f3f3f3';
    ctx.fillRect(paddingLeft, paddingTop, outer.clientWidth - paddingLeft - paddingRight, trackHeight);

    // center line
    ctx.fillStyle = '#e0e0e0';
    ctx.fillRect(paddingLeft, paddingTop + trackHeight / 2, outer.clientWidth - paddingLeft - paddingRight, 1);

    // minutes
    // every 60

    let step = 0;
    let small = 0;

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

    if (scale > 6) {
      step = 15;
      small = 1;
    }

    for (let i = 0; i < Math.round(duration); i++) {
      ctx.fillStyle = '#4c4c4c';
      ctx.fillRect(paddingLeft + i * step * scale, paddingTop + trackHeight + paddingTop, 1, timeMainNotchHeight);
      ctx.fillText(getFormatted(i * step), paddingLeft + i * step * scale, paddingTop + trackHeight + paddingTop + timeMainNotchHeight + 8 + 3);

      for (let j = 1; j < step / small; j++) {
        ctx.fillStyle = '#ababab';
        ctx.fillRect(paddingLeft + i * step * scale + j * small * scale, paddingTop + trackHeight + paddingTop + 1, 1, timeMainNotchHeight - 1);
      }
    }

    // audio tracks
    for (const part of $CurrentParts) {
      if (selectedParts.includes(part.id)) {
        ctx.fillStyle = '#248093';
      } else {
        ctx.fillStyle = '#000000';
      }
      ctx.fillRect(paddingLeft + part.start * scale, paddingTop, (part.end - part.start) * scale, trackHeight);

      const peakLines = compressPeaks(part.peaks, (part.end - part.start) * scale / 2);

      for (let i = 0; i < peakLines.length; i++) {
        ctx.fillStyle = '#e5e5e5';
        const peak = peakLines[i];
        ctx.fillRect(paddingLeft + part.start * scale + i * 2, paddingTop + trackHeight / 2 - (peak - 1) * trackHeight / 2, 1, (peak - 1) * trackHeight + 1);
      }
    }

    // cursor
    ctx.fillStyle = '#be2a2c';
    ctx.fillRect(paddingLeft + currentTime * scale, paddingTop / 2, cursorWidth, trackHeight + paddingTop);
    ctx.beginPath();
    ctx.arc(paddingLeft + currentTime * scale + cursorWidth / 2, paddingTop / 2, cursorRadius, 0, Math.PI * 2);
    ctx.arc(paddingLeft + currentTime * scale + cursorWidth / 2, trackHeight + paddingTop + paddingTop / 2, cursorRadius, 0, Math.PI * 2);
    ctx.fill();
  };

  let seeking = false;

  const onCanvasDown = (e: MouseEvent) => {
    if (e.offsetY > paddingTop && e.offsetY < paddingTop + trackHeight) {
      let hasSelected = false;
      for (const part of $CurrentParts) {
        if (e.clientX >= paddingLeft + part.start * scale && e.clientX <= paddingLeft + part.start * scale + (part.end - part.start) * scale) {
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
    if (e.offsetY > paddingTop + trackHeight && !seeking) {
      seeking = true;
      const x = e.offsetX - paddingLeft;
      dispatch('seek', { time: x / scale });
      currentTime = x / scale;
    }
  };

  const onCanvasMove = (e: MouseEvent) => {
    if (seeking) {
      seeking = true;
      const x = e.offsetX - paddingLeft;
      dispatch('seek', { time: x / scale });
      currentTime = x / scale;
    }
  };

  const onCanvasUp = (e: MouseEvent) => {
    seeking = false;
  };
</script>


<!--<div class='project-name'>
  <input bind:value={$ProjectName} on:blur={(e) => onProjectNameChange(e.target.value)}>
</div>-->

<div class='toolbar'>
  <button on:click={() => scale++}>
    <i class='fas fa-search-plus'></i>
  </button>
  <button on:click={() => {if(scale > 1) scale--}}>
    <i class='fas fa-search-minus'></i>
  </button>
  <button on:click={() => onDeleteClick()}>
    <i class='far fa-trash-alt'></i>
  </button>
</div>

{#each $Voices as voice}
  <div class='track-outer' bind:this={outer} style={`height: ${fullHeight}px`}>
    <canvas bind:this={canvasElement} on:mousedown={onCanvasDown} on:mousemove={onCanvasMove}
            on:mouseup={onCanvasUp}></canvas>
  </div>
{/each}


<style>
  .project-name {
    position: fixed;
    z-index: 10000;
    left: 10px;
    top: 5px;
    width: 100vw;
    height: 40px;
  }

  .project-name input {
    background: #ffffff;
  }

  .delete-button {
    position: absolute;
    bottom: 0;
  }

  .track-outer {
    user-select: none;

    position: fixed;
    z-index: 10000;

    left: 0;
    top: calc(10px + 40px);
    width: 100vw;
    /*height: 80px;*/

    /*background: #f3f3f3;*/
    /*border: #e0e0e0 1px solid;*/
    /*border-radius: 6px;*/
    box-shadow: 0 0 3px 0 #000000;
  }

  .toolbar {
    position: fixed;
    z-index: 10000;
    left: 10px;
    top: 5px;
    width: 200px;
    padding: 7px;
    background: #ffffff;
  }

  .name {
    display: flex;

  }

  input {
    font-family: 'Roboto Mono', monospace;
    font-weight: bold;
    background: none;
    border: none;
    outline: none;
    padding-bottom: 5px;
  }

  input:focus {
    border-bottom: 1px solid #000000;
  }

  .track-container {
    position: absolute;
    top: 3px;
    left: 3px;
    right: 3px;
    height: calc(100% - 6px);
    background: #beceb2;
    border-radius: 4px;
  }

  .recording-part {
    box-sizing: border-box;
    position: absolute;
    top: 0;
    height: 100%;
    background: #e9cd98;
    border: #e7ab51 1px solid;
    border-radius: 4px;
  }

  .cursor {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 1px;
    background: #e64b3d;
  }
</style>
