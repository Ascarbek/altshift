<script>
  import { tweened } from 'svelte/motion';
  import { cubicOut } from 'svelte/easing';

  const progress = tweened(0, {
    duration: 300,
    easing: cubicOut,
  });

  export let videoId = '';
  let audioName = '';

  const uploadUrl = `https://localhost:5010/submit-form`;

  export function sendUploadForm(data, progressFn) {
    let formData = new FormData();

    return new Promise((resolve, reject) => {
      const request = new XMLHttpRequest();
      request.open('post', uploadUrl);
      request.upload.addEventListener('progress', progressFn);
      request.addEventListener('load', function(e) {
        if(request.status === 200) {
          resolve(JSON.parse(request.response));
        }
        else {
          reject(request.response);
        }
      });

      for(let d=0; d<data.length; d++) {
        const key = Object.keys(data[d])[0];
        formData.append(key, data[d][key]);
      }

      request.send(formData);
    });
  }

  async function fileSelect(e) {
    const files = e.target.files;
    if(!files || files.length === 0) return;

    let data = [];

    data.push({ 'trackFile': files[0] });

    await sendUploadForm(data, e => {
      progress.set(e.loaded / e.total);
    });
  }
</script>

<div class="upload-form">
  <div class="upload-handle">
    <input type="file" on:change={fileSelect}>
  </div>
  <progress value={$progress}></progress>
  <label>Name</label>
  <input type="text" bind:value={audioName}>
  <button on:click={fileSelect}>Save</button>
</div>

<style>
  .upload-form {
    background: #555555;
  }

  progress {
    display: block;
    width: 100%;
  }

  .upload-form {
    position: fixed;
    z-index: 10000;
    width: 500px;
    height: 250px;
    margin: auto;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }
</style>
