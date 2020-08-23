import './firestore.js';

const host = `https://localhost:5010`;

const getByVideoIdUrl = `${host}/get-by-video-id`;
const uploadUrl = `${host}/submit-form`;

const saveAudioFileUrl = `${host}/save-audio-file`;


const getTagsUrl = `${host}/get-tags`;
const addNewTagUrl = `${host}/add-new-tag`;
const toggleTagUrl = `${host}/toggle-tag`;




export const getAudioFilesByVideoId = async (videoId, videoType) => {
  return;
  /*
  const url = new URL(getByVideoIdUrl);

  url.searchParams.append('videoId', videoId);
  url.searchParams.append('videoType', videoType);

  const resp = await window.fetch(url.toString())
  const parsed = await resp.json();
  */



  return Promise.resolve([]);
}

interface UploadResponse {
  fileName: string;
};

export const sendUploadForm = (data, progressFn): Promise<UploadResponse> => {
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

export const saveAudioFile = async (data) => {
  await window.fetch(saveAudioFileUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
}

export const getTags = async () => {
  const url = new URL(getTagsUrl);

  const resp = await window.fetch(url.toString())
  const parsed = await resp.json();

  return parsed.tags;
}


export const addNewTag = async (data) => {
  const resp = await window.fetch(addNewTagUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
}

export const toggleTag = async (data) => {
  const resp = await window.fetch(toggleTagUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
}



