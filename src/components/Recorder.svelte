<script lang="ts">
  import { onDestroy, onMount, tick, createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  let canvasElement: HTMLCanvasElement;

  let stream;
  export let streamPromise;
  let mediaRecorder;

  enum state {
    ALLOW_MESSAGE,
    DECLINED_MESSAGE,
    FIRST_MESSAGE,
    ACTIVE_RECORDING,
    SAVE_MENU,
  }

  let currentState: state = state.FIRST_MESSAGE;

  onMount(() => {
    window.addEventListener('keydown', keyDown);
    window.addEventListener('keyup', keyUp);
  });

  const keyDown = (e) => {
    if(e.ctrlKey) {
      currentState = state.ACTIVE_RECORDING;

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
    currentState = state.SAVE_MENU;

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
    currentState = state.ALLOW_MESSAGE;
    promise.then(res => {
      currentState = state.FIRST_MESSAGE;
      stream = res;
    }).catch(e => {
      currentState = state.DECLINED_MESSAGE;
    });
  }
</script>

<div class="recorder">
  <canvas bind:this={canvasElement} class="visualizer" class:hidden={currentState !== state.ACTIVE_RECORDING}></canvas>

  <div class="msg" class:hidden={currentState !== state.ALLOW_MESSAGE}>
    Please allow use<br> of microphone.
  </div>

  <div class="msg" class:hidden={currentState !== state.DECLINED_MESSAGE}>
    You have blocked use<br> of microphone.
  </div>

  <div class="msg" class:hidden={currentState !== state.FIRST_MESSAGE}>
    hold <b>ctrl</b> key to start.<br>
    release to pause.
  </div>

  <div class="msg" class:hidden={currentState !== state.SAVE_MENU}>
    press <b>Ok</b> to save.<br>
    or <b>ctrl</b> to continue.
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
