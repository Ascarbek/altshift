<script lang='ts'>
  import { onDestroy, onMount } from 'svelte';
  import { getProject, newProject, newRecording, uploadBlob } from './api/firebase-app';
  import { CurrentParts, currentUser, ProjectId, ProjectName, Voices } from './api/svelte-stores';

  import { IProject, RecordingStates } from './api/types';

  let canvasElement: HTMLCanvasElement;

  // need to come from user event
  export let streamPromise: Promise<MediaStream>;

  let mediaRecorder;

  export let videoType: string;
  export let videoId: string;
  export let duration: number;

  export let currentState: RecordingStates;

  let recordingId: string;
  let currentStartTime: number;
  let currentEndTime: number;

  export let projectName: string;
  export let voiceName: string;

  let currentProject: IProject;

  onMount(async () => {
    window.addEventListener('keydown', keyDown);
    window.addEventListener('keyup', keyUp);

    const test = await getProject(videoType, videoId);
    if (test) {
      currentProject = test;
    } else {
      currentProject = await newProject(projectName, videoType, videoId, voiceName);
    }
  });

  $: loadData(currentProject);

  function loadData(_data: IProject) {
    if (!_data) return;
    $Voices = [{ name: _data.voices[0].name }];
    $ProjectName = _data.name;
    $ProjectId = _data.id;
  }

  const keyDown = (e) => {
    if (e.ctrlKey) {
      if (currentState === RecordingStates.ACTIVE_RECORDING) return;
      currentState = RecordingStates.ACTIVE_RECORDING;

      if (document.querySelector('video')) {
        const video = document.querySelector('video');
        video.play();
        currentStartTime = video.currentTime;
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
    }
    mediaRecorder.stop();
    mediaRecorder.addEventListener('dataavailable', onDataAvailable);
  };

  onDestroy(() => {
    window.removeEventListener('keydown', keyDown);
    window.removeEventListener('keyup', keyUp);
  });

  let saveProgress = 0;

  const onDataAvailable = async (e) => {
    mediaRecorder.removeEventListener('dataavailable', onDataAvailable);

    currentState = RecordingStates.SAVING_PROGRESS;
    saveProgress = 0;

    let recording = await newRecording({
      projectId: $ProjectId,
      authorId: $currentUser.uid,
      voiceName: voiceName,
      start: currentStartTime,
      end: currentEndTime,
      created: new Date().getTime(),
    });

    saveProgress = 10;

    uploadBlob(`Recordings/${recording.id}.webm`, e.data, (p) => {
      saveProgress = p;
    }, () => {
      currentState = RecordingStates.PAUSE_MESSAGE;
      $CurrentParts = [...$CurrentParts, recording];
    });
  };

  $: onRecordingStateChange(currentState);

  function onRecordingStateChange(state) {
    if (state === RecordingStates.ALLOW_MESSAGE)
      showDlg();
  }

  function visualize(stream) {
    if (!stream) return;
    const audioCtx = new AudioContext();
    mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
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

      let sliceWidth = WIDTH * 1.0 / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {

        let v = dataArray[i] / 128.0;
        let y = v * HEIGHT / 2;

        if (i === 0) {
          canvasCtx.moveTo(x, y);
        } else {
          canvasCtx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      canvasCtx.lineTo(canvasElement.width, canvasElement.height / 2);
      canvasCtx.stroke();
    }
  }

  export let showDlg = () => {
    streamPromise.then(res => {
      currentState = RecordingStates.FIRST_MESSAGE;
      visualize(res);
    }).catch(e => {
      currentState = RecordingStates.DECLINED_MESSAGE;
    });
  };
</script>

<div class='recorder'>
  <canvas bind:this={canvasElement} class='visualizer'
          class:hidden={currentState !== RecordingStates.ACTIVE_RECORDING}></canvas>

  <div class='msg' class:hidden={currentState !== RecordingStates.ALLOW_MESSAGE}>
    Please allow use<br> of microphone.
  </div>

  <div class='msg' class:hidden={currentState !== RecordingStates.DECLINED_MESSAGE}>
    You have blocked use<br> of microphone.
  </div>

  <div class='msg' class:hidden={currentState !== RecordingStates.FIRST_MESSAGE}>
    hold <b>ctrl</b> key to start.<br>
    release to pause.
  </div>

  <div class='msg' class:hidden={currentState !== RecordingStates.SAVING_PROGRESS}>
    {#each [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] as p}
      <div class='upload-progress fill' class:fill={saveProgress > p*10+5} style={`left: ${30 + p*15}px`}>
      </div>
    {/each}
  </div>

  <div class='msg' class:hidden={currentState !== RecordingStates.PAUSE_MESSAGE}>
    press <b>Ok</b> to save.<br>
    or <b>ctrl</b> to continue.
  </div>

  <div class='msg' class:hidden={currentState !== RecordingStates.SAVE_MENU}>
    <input>
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
