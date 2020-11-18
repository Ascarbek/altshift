<script lang="ts">
  import {onDestroy, onMount,} from "svelte";
  import {newRecording, uploadBlob} from './api/firebase-app';

  import {RecordingStates} from './api/types';

  // const dispatch = createEventDispatcher();

  let canvasElement: HTMLCanvasElement;

  // let stream;

  // need to come from user event
  export let streamPromise: Promise<MediaStream>;

  let mediaRecorder;

  export let videoId: string;
  export let duration: number;

  export let currentState: RecordingStates;

  let recordingId: string;
  let voiceId: string;
  let currentStartTime: number;
  let currentEndTime: number;
  // let partNum: number = 0;

  onMount(async () => {
    window.addEventListener('keydown', keyDown);
    window.addEventListener('keyup', keyUp);

    // await createAuthor();
    // recordingId = await newRecording({lang: 'ru', name: 'newRecording', videoId: videoId, duration: duration});
    // voiceId = await newVoice({name: 'male', recordingId: recordingId});
  });

  const keyDown = (e) => {
    if(e.ctrlKey) {
      if(currentState === RecordingStates.ACTIVE_RECORDING) return;
      currentState = RecordingStates.ACTIVE_RECORDING;

      if(document.querySelector('video')) {
        const video = document.querySelector('video');
        video.play();
        currentStartTime = video.currentTime;
      }

      if(mediaRecorder.state !== 'recording') {
        mediaRecorder.start();
      }
    }
  };

  const keyUp = (e) => {
    if(currentState !== RecordingStates.ACTIVE_RECORDING) return;
    currentState = RecordingStates.PAUSE_MESSAGE;

    if(document.querySelector('video')) {
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

    /*
    partNum++;
    const partId = await newPart({partNum: partNum, recordingId: recordingId, voiceId: voiceId, start: currentStartTime, end: currentEndTime});

    CurrentParts.update(cp => [...cp, {partNum: partNum, recordingId: recordingId, voiceId: voiceId, start: currentStartTime, end: currentEndTime}]);
    */

    currentState = RecordingStates.SAVING_PROGRESS;
    saveProgress = 0;

    let recordingId = await newRecording({projectId: 'project 1', voiceName: 'male 1', start: currentStartTime, end: currentEndTime});

    saveProgress = 10;

    uploadBlob('', `Recordings/${recordingId}.webm`, e.data, (p) => {
      saveProgress = p;
    }, () => {
      currentState = RecordingStates.PAUSE_MESSAGE;
    });
  };

  $: onRecordingStateChange(currentState);

  function onRecordingStateChange(state) {
    if(state === RecordingStates.ALLOW_MESSAGE)
      showDlg();
  }

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
      // this is a hotfix
      if(!canvasElement) return;

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

  export let showDlg = () => {
    streamPromise.then(res => {
      currentState = RecordingStates.FIRST_MESSAGE;
      // stream = res;
      visualize(res);
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

  <div class="msg" class:hidden={currentState !== RecordingStates.SAVING_PROGRESS}>
    {#each [0,1,2,3,4,5,6,7,8,9] as p}
      <div class="upload-progress fill" class:fill={saveProgress > p*10+5} style={`left: ${30 + p*15}px`}>
      </div>
    {/each}
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
