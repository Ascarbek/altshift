<script lang='ts'>
  import { createEventDispatcher, onDestroy, onMount } from 'svelte';
  import { ProjectName, Voices, CurrentParts, ProjectId } from './api/svelte-stores';
  import { deleteRecording, getRecordings } from './api/firebase-app';

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

  let showToolbarButtons = false;
  export let onProjectNameChange: (v: string) => void;


  let hoveringPart: number = -1;

  const onDeleteClick = async (e, part) => {
    e.stopPropagation();

    await deleteRecording(part.id);
    $CurrentParts = await getRecordings($ProjectId);
  };

  let canvasElement: HTMLCanvasElement;
  let outer;
  let handler;

  onMount(() => {
    handler = setInterval(render, 100);
  });

  /*
  $: $CurrentParts && (async () => {
    if ($CurrentParts.length > 0) {
      for (const part of $CurrentParts) {
        await deleteRecording(part.id);
      }
    }
  })();
*/

  $: console.log($CurrentParts);

  onDestroy(() => {
    clearInterval(handler);
  });

  const fullHeight = 90;
  const paddingTop = 10;
  const paddingBottom = 20;
  const paddingLeft = 5;
  const paddingRight = 5;
  const trackHeight = 40;
  const cursorWidth = 2;
  const cursorRadius = 3;
  const timeMainNotchHeight = 5;
  let scale = 4;

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
    for (let i = 0; i < 12; i++) {
      ctx.fillStyle = '#4c4c4c';
      ctx.fillRect(paddingLeft + i * 60 * scale, paddingTop + trackHeight + paddingTop, 1, timeMainNotchHeight);
      ctx.fillText(`${i}:00`, paddingLeft + i * 60 * scale, paddingTop + trackHeight + paddingTop + timeMainNotchHeight + 8 + 3);

      for (let j = 1; j < 4; j++) {
        ctx.fillStyle = '#ababab';
        ctx.fillRect(paddingLeft + i * 60 * scale + j * 15 * scale, paddingTop + trackHeight + paddingTop + 1, 1, timeMainNotchHeight - 1);
      }
    }

    // audio tracks
    for (const part of $CurrentParts) {
      ctx.fillStyle = '#000000';
      ctx.fillRect(paddingLeft + part.start * scale, paddingTop, (part.end - part.start) * scale, trackHeight);

      for (let i = 0; i < part.peaks.length; i++) {
        if (i > 1 && i < part.peaks.length - 2) {
          ctx.fillStyle = '#e5e5e5';
          const step = i;
          const peak = part.peaks[step];
          ctx.fillRect(paddingLeft + part.start * scale + step * 2, paddingTop + trackHeight / 2 - (peak - 1) * trackHeight / 2, 1, (peak - 1) * trackHeight + 1);
        }
      }
    }

    // cursor
    ctx.fillStyle = '#be2a2c';
    ctx.fillRect(currentTime * scale, paddingTop / 2, cursorWidth, trackHeight + paddingTop);
    ctx.beginPath();
    ctx.arc(currentTime * scale + cursorWidth / 2, paddingTop / 2, cursorRadius, 0, Math.PI * 2);
    ctx.arc(currentTime * scale + cursorWidth / 2, trackHeight + paddingTop + paddingTop / 2, cursorRadius, 0, Math.PI * 2);
    ctx.fill();
  };


</script>


<!--<div class='project-name'>
  <input bind:value={$ProjectName} on:blur={(e) => onProjectNameChange(e.target.value)}>
</div>-->

{#each $Voices as voice}
  <div class='track-outer' bind:this={outer} style={`height: ${fullHeight}px`}>
    <canvas bind:this={canvasElement}></canvas>

    <!--
    <div class='track-container' on:mousedown={onMouseDown} bind:this={trackEl}>
      {#each $CurrentParts as part, index}
        <div class='recording-part'
             on:mouseenter={() => hoveringPart = index}
             style={`left: ${part.start*100/duration}%; right: ${100 - part.end*100/duration}%`}>

          {#if hoveringPart === index}
            <button on:mousedown={(e) => e.stopPropagation()}  on:click={(e) => onDeleteClick(e, part)} class='delete-button'><i class='far fa-trash-alt'></i></button>
          {/if}
        </div>
      {/each}
      <div class='cursor' style={`left: ${currentTime*100/duration}%`}></div>
    </div>
    <div class='toolbar' on:mouseenter={() => showToolbarButtons = true}
         on:mouseleave={() => showToolbarButtons = false}>
      <div class='name'>
        <input bind:value={voice.name}>
        {#if showToolbarButtons}
          <div class=''>
            <button>
              <i class='fas fa-plus'></i>
            </button>
          </div>
        {/if}
      </div>
    </div>
    -->
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
    position: absolute;
    top: 5px;
    left: 10px;
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
