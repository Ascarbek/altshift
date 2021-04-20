<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import { CurrentParts, currentUser, ProjectId, RecordingStart, Voices } from './api/svelte-stores';
  import { v4 } from 'uuid';

  import type { IProject } from './api/types';
  import { RecordingStates } from './api/types';
  import { compressPeaks } from './api/waveHelpers';
  import { getOrCreateProject, uploadPart } from './api/backend';
  import axios from 'axios';

  let canvasElement: HTMLCanvasElement;

  // need to come from user event
  export let streamPromise: Promise<MediaStream>;

  let mediaRecorder;

  export let videoType: string;
  export let videoId: string;

  export let currentState: RecordingStates;

  let currentStartTime: number;
  let currentEndTime: number;

  export let projectName: string;
  export let voiceName: string;

  let currentProject: IProject;

  onMount(async () => {
    window.addEventListener('keydown', keyDown);
    window.addEventListener('keyup', keyUp);
  });

  $: loadData(currentProject);

  function loadData(_data: IProject) {
    if (!_data) return;
    $Voices = [{ name: 'default voice' }];
    $ProjectId = _data.id;
  }

  const keyDown = (e) => {
    if (e.ctrlKey) {
      if (currentState === RecordingStates.ACTIVE_RECORDING) return;
      currentState = RecordingStates.ACTIVE_RECORDING;
      wavePeaks = [];

      if (document.querySelector('video')) {
        const video = document.querySelector('video');
        video.play();
        currentStartTime = video.currentTime;
        $RecordingStart = currentStartTime;
      }

      if (mediaRecorder.state !== 'recording') {
        mediaRecorder.start();
      }
    }
  };

  const keyUp = (e) => {
    if (currentState !== RecordingStates.ACTIVE_RECORDING) return;
    currentState = RecordingStates.PAUSE_MESSAGE;

    if (document.querySelector('video')) {
      const video = document.querySelector('video');
      video.pause();
      currentEndTime = video.currentTime;
      $RecordingStart = -1;

      // every 100ms
      peakLines = compressPeaks(wavePeaks, (currentEndTime - currentStartTime) * 10);
    }
    // avoid cutoffs in the end
    setTimeout(() => {
      mediaRecorder.stop();
      mediaRecorder.addEventListener('dataavailable', onDataAvailable);
    }, 100);
  };

  onDestroy(() => {
    window.removeEventListener('keydown', keyDown);
    window.removeEventListener('keyup', keyUp);
  });

  let saveProgress = 0;

  const onDataAvailable = async (e) => {
    mediaRecorder.removeEventListener('dataavailable', onDataAvailable);

    saveProgress = 0;

    const blob = new Blob([e.data], { type: 'audio/ogg; codecs=opus' });
    const file: File = new File([blob], `myPart.webm`);

    const data = await uploadPart(file, $ProjectId, currentStartTime, currentEndTime, peakLines);

    $CurrentParts = [
      ...$CurrentParts,
      {
        id: data.id,
        start: data.start,
        end: data.end,
        path: data.path,
        peaks: data.peaks,
        voiceName: voiceName,
        created: data.created_at,
      },
    ];
  };

  $: onRecordingStateChange(currentState);

  async function onRecordingStateChange(state) {
    if (state === RecordingStates.ALLOW_MESSAGE) {
      showDlg();
    }

    if (state === RecordingStates.LOADING) {
      const resp = await getOrCreateProject(videoType, videoId);
      currentProject = { id: resp.project_id, videoId, videoType, voices: [], authorId: $currentUser.uid };
      $CurrentParts = resp.parts;
      currentState = RecordingStates.FIRST_MESSAGE;
    }
  }

  let wavePeaks: number[] = [];
  let peakLines: number[] = [];

  function visualize(stream) {
    if (!stream) return;
    const audioCtx = new AudioContext();
    mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm', audioBitsPerSecond: 256000 });
    let canvasCtx = canvasElement.getContext('2d');
    let source = audioCtx.createMediaStreamSource(stream);

    let analyser = audioCtx.createAnalyser();
    analyser.fftSize = 2048;
    let bufferLength = analyser.frequencyBinCount;
    let dataArray = new Uint8Array(bufferLength);

    source.connect(analyser);

    let WIDTH = canvasElement.width;
    let HEIGHT = canvasElement.height;

    draw();

    function draw() {
      // this is a hotfix
      if (!canvasElement) return;

      requestAnimationFrame(draw);

      analyser.getByteTimeDomainData(dataArray);

      canvasCtx.fillStyle = 'rgb(200, 200, 200)';
      canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
      canvasCtx.lineWidth = 2;
      canvasCtx.strokeStyle = 'rgb(0, 0, 0)';
      canvasCtx.beginPath();

      let sliceWidth = (WIDTH * 1.0) / bufferLength;
      let x = 0;

      let peak = 0;

      for (let i = 0; i < bufferLength; i++) {
        let v = dataArray[i] / 128.0;
        let y = (v * HEIGHT) / 2;

        if (v > peak) peak = v;

        if (i === 0) {
          canvasCtx.moveTo(x, y);
        } else {
          canvasCtx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      if (currentState === RecordingStates.ACTIVE_RECORDING) {
        wavePeaks.push(peak);
      }

      canvasCtx.lineTo(canvasElement.width, canvasElement.height / 2);
      canvasCtx.stroke();
    }
  }

  export let showDlg = () => {
    streamPromise
      .then((res) => {
        currentState = RecordingStates.LOADING;
        visualize(res);
      })
      .catch((e) => {
        currentState = RecordingStates.DECLINED_MESSAGE;
      });
  };
</script>

<div class="recorder">
  <canvas
    bind:this="{canvasElement}"
    class="visualizer"
    class:hidden="{currentState !== RecordingStates.ACTIVE_RECORDING}"></canvas>

  <div class="msg" class:hidden="{currentState !== RecordingStates.ALLOW_MESSAGE}">
    Please allow use<br /> of microphone.
  </div>

  <div class="msg" class:hidden="{currentState !== RecordingStates.DECLINED_MESSAGE}">
    You have blocked use<br /> of microphone.
  </div>

  <div class="msg" class:hidden="{currentState !== RecordingStates.LOADING}">please wait...</div>

  <div class="msg" class:hidden="{currentState !== RecordingStates.FIRST_MESSAGE}">
    hold <b>ctrl</b> key to start.<br />
    release to pause.
  </div>

  <div class="msg" class:hidden="{currentState !== RecordingStates.SAVING_PROGRESS}">
    {#each [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] as p}
      <div
        class="upload-progress fill"
        class:fill="{saveProgress > p * 10 + 5}"
        style="{`left: ${30 + p * 15}px`}"
      ></div>
    {/each}
  </div>

  <div class="msg" class:hidden="{currentState !== RecordingStates.PAUSE_MESSAGE}">
    press <b>Ok</b> to save.<br />
    or <b>ctrl</b> to continue.
  </div>

  <div class="msg" class:hidden="{currentState !== RecordingStates.SAVE_MENU}">
    <input />
  </div>
</div>

<style>
  .hidden {
    display: none;
  }

  .msg {
    padding: 3px 5px;
    text-align: center;
  }

  .msg input {
    border: none;
    background: none;
    outline: none;
    padding-bottom: 10px;
    border-bottom: #464c4b 1px solid;
  }

  .visualizer {
  }

  .recorder {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  canvas {
    width: 100%;
    height: 100%;
  }

  .upload-progress {
    background: #9e9e9e;
    width: 13px;
    height: 2px;
    bottom: 9px;
    position: absolute;
  }

  .upload-progress.fill {
    height: 20px;
  }
</style>
