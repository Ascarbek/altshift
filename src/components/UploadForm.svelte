<script>
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

  let files;

  async function fileSelect(e) {
    console.log(files);
    // const files = e.target.files;
    if(!files || files.length === 0) return;

    let data = [];

    data.push({"trackFile": files[0]});

    data.push({ videoId });
    data.push({ audioName });


    const newPictures = await sendUploadForm(data/*, e => {
      uploadProgress = ((e.loaded / e.total)*100).toFixed(0);
    }*/);

    // showUpload = true;

    console.log('uploaded');

    // pictures = [...pictures, ...newPictures];

  }
</script>

<div class="upload-form">
  <input type="file" bind:files={files}>
  <input type="text" bind:value={audioName}>
  <button on:click={fileSelect}></button>
</div>

<style>
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
