<script lang="ts">
  import { onMount, tick } from "svelte";

  let canvasElement: HTMLCanvasElement;


  export let stream;

  let WIDTH = 0, HEIGHT = 0;

  $: visualize(stream);

  function visualize(stream) {
    if(!stream) return;
    const audioCtx = new AudioContext();
    var canvasCtx = canvasElement.getContext("2d");
    var source = audioCtx.createMediaStreamSource(stream);

    var analyser = audioCtx.createAnalyser();
    analyser.fftSize = 2048;
    var bufferLength = analyser.frequencyBinCount;
    var dataArray = new Uint8Array(bufferLength);

    source.connect(analyser);
    //analyser.connect(audioCtx.destination);

    WIDTH = canvasElement.width
    HEIGHT = canvasElement.height;

    draw()

    function draw() {
      // console.log(dataArray);
      // console.log('drawing');
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
</script>

<div class="recorder">
  <canvas bind:this={canvasElement} class="visualizer"></canvas>
</div>

<style>
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
