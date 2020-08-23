
const backendUrl = 'https://localhost:5010/static/';

let audioRefreshNeeded = true;

function pauseHandler(e) {
  const audio = document.getElementById('my-track-extension-player');
  audio.pause();
  audioRefreshNeeded = true;
}

function playHandler(e) {
  const audio = document.getElementById('my-track-extension-player');
  audio.play();
}

function timeHandler(e) {
  // if(!audioRefreshNeeded) return;

  const video = document.querySelector('video');
  const audio = document.getElementById('my-track-extension-player');

  if(!video || !audio) return;

  audio.currentTime = e.target.currentTime + audioDelay;
  console.log(e.target.currentTime);

  if(!video.paused) {
    audio.play();
  }

  audioRefreshNeeded = false;
}

let audioDelay = 0.0;

const AudioPlayer = {
  renderAudioPlayer: (filename, type = 'audio/ogg') => {
    const id = 'my-track-extension-player-wrapper';

    const template = `
      <audio id="my-track-extension-player">
        <source src="${backendUrl}${filename}" type="${type}">
      </audio>
    `;

    if(document.getElementById(id)) {
      let component = document.getElementById(id);
      component.innerHTML = template;
      AudioPlayer.removeHandlers();
      AudioPlayer.attachEvents();
    } else {
      let component = document.createElement('div');
      component.id = id;
      component.className = id;
      component.innerHTML = template;
      document.body.appendChild(component);
      AudioPlayer.attachEvents();
    }

    audioRefreshNeeded = true;

  },

  setAudioDelay: (sec) => {
    audioDelay = sec;
    audioRefreshNeeded = true;
  },

  getAudioDelay: () => {
    return audioDelay;
  },

  attachEvents: () => {
    let handler = setInterval(() => {

      if(document.querySelector('video')) {
        clearInterval(handler);

        document.querySelector('video').addEventListener('pause', pauseHandler);
        document.querySelector('video').addEventListener('play', playHandler);
        document.querySelector('video').addEventListener('timeupdate', timeHandler);

      }
    }, 100);

    /*
   document.querySelector('video').addEventListener('seeking', (e) => {
     console.log('seek started ', e);
   });
   document.querySelector('video').addEventListener('seeked', (e) => {
     console.log('seek completed ', e);
   });
   */
  },

  removeHandlers: () => {
    if(document.querySelector('video')) {
      document.querySelector('video').removeEventListener('pause', pauseHandler);
      document.querySelector('video').removeEventListener('play', playHandler);
      document.querySelector('video').removeEventListener('timeupdate', timeHandler);
    }
  },
};

export default AudioPlayer;


