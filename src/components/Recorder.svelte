<script lang="ts">
  import { onDestroy, onMount, tick, createEventDispatcher } from "svelte";
  import { createAuthor, newRecording, newVoice, newPart } from './api/firebase-app';

  import { RecordingStates } from './api/types';

  const dispatch = createEventDispatcher();

  let canvasElement: HTMLCanvasElement;

  let stream;
  export let streamPromise;
  let mediaRecorder;

  export let videoId: string;

  let currentState: RecordingStates = RecordingStates.FIRST_MESSAGE;

  onMount(async () => {
    window.addEventListener('keydown', keyDown);
    window.addEventListener('keyup', keyUp);

    createAuthor();
    const recId = await newRecording({lang: 'ru', name: 'newRecording', videoId: videoId});
    const voiceId = await newVoice({name: 'male', recordingId: recId});
    const partId = await newPart({recordingId: recId, voiceId: voiceId, start: 0, end: 1});
  });

  const keyDown = (e) => {
    if(e.ctrlKey) {
      currentState = RecordingStates.ACTIVE_RECORDING;

      if(document.querySelector('video')) {
        const video = document.querySelector('video');
        video.play();
      }

      if(mediaRecorder.state !== 'recording') {
        mediaRecorder.start();
      }
    }
  };

  const keyUp = (e) => {
    currentState = RecordingStates.PAUSE_MESSAGE;

    if(document.querySelector('video')) {
      const video = document.querySelector('video');
      video.pause();
    }

    mediaRecorder.stop();
    mediaRecorder.addEventListener('dataavailable', onDataAvailable);
  };

  onDestroy(() => {
    window.removeEventListener('keydown', keyDown);
    window.removeEventListener('keyup', keyUp);
  });

  const onDataAvailable = (e) => {
    mediaRecorder.removeEventListener('dataavailable', onDataAvailable);
    dispatch('onDataAvailable', e.data);
  };

  $: visualize(stream);

  $: showDlg(streamPromise);

  function visualize(stream) {
    if(!stream) return;
    const audioCtx = new AudioContext();
    mediaRecorder = new MediaRecorder(stream, {mimeType: 'audio/webm'});
    var canvasCtx = canvasElement.getContext("2d");
    var source = audioCtx.createMediaStreamSource(stream);

    var analyser = audioCtx.createAnalyser();
    analyser.fftSize = 2048;
    var bufferLength = analyser.frequencyBinCount;
    var dataArray = new Uint8Array(bufferLength);

    source.connect(analyser);

    let WIDTH = canvasElement.width
    let HEIGHT = canvasElement.height;

    draw()

    function draw() {
      requestAnimationFrame(draw);

      analyser.getByteTimeDomainData(dataArray);

      canvasCtx.fillStyle = 'rgb(200, 200, 200)';
      canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
      canvasCtx.lineWidth = 2;
      canvasCtx.strokeStyle = 'rgb(0, 0, 0)';
      canvasCtx.beginPath();

      var sliceWidth = WIDTH * 1.0 / bufferLength;
      var x = 0;

      for(var i = 0; i < bufferLength; i++) {

        var v = dataArray[i] / 128.0;
        var y = v * HEIGHT/2;

        if(i === 0) {
          canvasCtx.moveTo(x, y);
        } else {
          canvasCtx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      canvasCtx.lineTo(canvasElement.width, canvasElement.height/2);
      canvasCtx.stroke();
    }
  }

  function showDlg(promise) {
    currentState = RecordingStates.ALLOW_MESSAGE;
    promise.then(res => {
      currentState = RecordingStates.FIRST_MESSAGE;
      stream = res;
    }).catch(e => {
      currentState = RecordingStates.DECLINED_MESSAGE;
    });
  }
</script>

<div class="recorder">
  <canvas bind:this={canvasElement} class="visualizer" class:hidden={currentState !== RecordingStates.ACTIVE_RECORDING}></canvas>

  <div class="msg" class:hidden={currentState !== RecordingStates.ALLOW_MESSAGE}>
    Please allow use<br> of microphone.
  </div>

  <div class="msg" class:hidden={currentState !== RecordingStates.DECLINED_MESSAGE}>
    You have blocked use<br> of microphone.
  </div>

  <div class="msg" class:hidden={currentState !== RecordingStates.FIRST_MESSAGE}>
    hold <b>ctrl</b> key to start.<br>
    release to pause.
  </div>

  <div class="msg" class:hidden={currentState !== RecordingStates.PAUSE_MESSAGE}>
    press <b>Ok</b> to save.<br>
    or <b>ctrl</b> to continue.
  </div>

  <div class="msg" class:hidden={currentState !== RecordingStates.SAVE_MENU}>
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
</style>
