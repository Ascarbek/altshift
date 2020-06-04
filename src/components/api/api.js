const host = `https://localhost:5010`;

const getByVideoIdUrl = `${host}/get-by-video-id`;
const uploadUrl = `${host}/submit-form`;

export async function getAudioFilesByVideoId(videoId, videoType) {
  const url = new URL(getByVideoIdUrl);

  url.searchParams.append('videoId', videoId);
  url.searchParams.append('videoType', videoType);

  const resp = await window.fetch(url.toString())
  const parsed = await resp.json();

  return Promise.resolve(parsed.audioFiles);
}

export function sendUploadForm(data, progressFn) {
  let formData = new FormData();

  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();
    request.open('post', uploadUrl);
    request.upload.addEventListener('progress', progressFn);
    request.addEventListener('load', e => {
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