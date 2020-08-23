import './TrackList.scss';
import API from "./API";
import AudioPlayer from "./AudioPlayer";
import UploadMedia from "./UploadMedia";

let audioFiles = [];
const componentId = 'my-track-extension-toolbar';
let currentVideoId;

let bodyMoveHandler;

function bodyMove() {
  if(bodyMoveHandler) {
    clearTimeout(bodyMoveHandler);
    bodyMoveHandler = undefined;
  }

  let component = document.getElementById(componentId);
  component.classList.add('active');
  component.classList.remove('collapsed');

  bodyMoveHandler = setTimeout(() => {
    component.classList.remove('active');
    component.classList.add('collapsed');
  }, 3000);
}

const TrackList = {

  renderTrackList: async videoId => {
    let component = document.getElementById(componentId);

    if(!component) {
      component = document.createElement('div');
      component.id = componentId;
      component.className = componentId;
      document.body.appendChild(component);
    }

    component.classList.add('active');

    if(videoId === currentVideoId) return;

    currentVideoId = videoId;

    audioFiles = await API.getAudioFiles(videoId);

    const listItems = audioFiles
      .map(item => `
        <div class="item">
          <div class="audio-data active">
            <button class="settings"><i class="icomoon-cog"></i></button>
            <div class="name" filename="${item.fileName}">${item.audioName}</div>
            <button class="up-vote"><i class="icomoon-up-vote"></i></button>
            <div class="vote-value">+15</div>
            <button class="down-vote"><i class="icomoon-down-vote"></i></button>
          </div>

          <div class="audio-settings collapsed">
            <span>Offset:</span>
            <button class="delay-minus">-</button>
            <div class="delay-value">0.0s</div>
            <button class="delay-plus">+</button>
            <button class="ok">OK</button>
          </div>
        </div>
      `)
      .reduce(((previousValue, currentValue) => previousValue += currentValue), '');

    const header = `
      <div class="header">
        <span>Tracks:</span>
      </div>
    `;

    const notFound = `
      <div class="not-found">No tracks were found for this video.</div>
    `;

    const uploadButton = `
      <div class="upload-button">
        <button>Upload Audio Track</button>
      </div>
    `;

    component.innerHTML = `
      ${header}
      <div class="list-items">
        ${audioFiles.length ? listItems : notFound}
      </div>
      ${uploadButton}
    `;

    setTimeout(() => {
      TrackList.attachEvents();
    }, 100);

    return Promise.resolve();
  },

  removeTrackList: () => {
    if(document.getElementById(componentId)) {
      currentVideoId = undefined;
      document.getElementById(componentId).outerHTML = '';
      document.removeEventListener('mousemove', bodyMove);
    }
  },

  attachEvents: () => {
    let component = document.getElementById(componentId);
    if(!component) return;

    document.addEventListener('mousemove', bodyMove);

    component.querySelectorAll('.item .audio-data .name').forEach(el => {
      el.addEventListener('click', e => {
        const filename = el.getAttribute('filename');
        AudioPlayer.renderAudioPlayer(filename);
      });
    });

    component.querySelectorAll('.item .audio-data .settings').forEach(el => {
      el.addEventListener('click', e => {
        bodyMove();

        const itemEl = el.parentElement.parentElement;

        itemEl.querySelector('.audio-data').classList.remove('active');
        itemEl.querySelector('.audio-data').classList.add('collapsed');
        itemEl.querySelector('.audio-settings').classList.add('active');
        itemEl.querySelector('.audio-settings').classList.remove('collapsed');
      });
    });

    component.querySelectorAll('.item .audio-settings .ok').forEach(el => {
      el.addEventListener('click', e => {
        const itemEl = el.parentElement.parentElement;

        itemEl.querySelector('.audio-data').classList.add('active');
        itemEl.querySelector('.audio-data').classList.remove('collapsed');
        itemEl.querySelector('.audio-settings').classList.remove('active');
        itemEl.querySelector('.audio-settings').classList.add('collapsed');
      });
    });

    component.querySelectorAll('.item .audio-settings .delay-plus').forEach(el => {
      el.addEventListener('click', (e) => {
        bodyMove();
        e.stopPropagation();

        let delta = 0.0;
        if(e.ctrlKey) {
          delta = 1.0;
        } else {
          delta = 0.1;
        }

        let sec = AudioPlayer.getAudioDelay() + delta;
        AudioPlayer.setAudioDelay(sec);
        el.parentElement.querySelector('.item .audio-settings .delay-value').innerHTML = sec.toFixed(1) + 's';
      });
    });

    component.querySelectorAll('.item .audio-settings .delay-minus').forEach(el => {
      el.addEventListener('click', (e) => {
        bodyMove();
        e.stopPropagation();

        let delta = 0.0;
        if(e.ctrlKey) {
          delta = 1.0;
        } else {
          delta = 0.1;
        }

        let sec = AudioPlayer.getAudioDelay() - delta;
        AudioPlayer.setAudioDelay(sec);
        el.parentElement.querySelector('.item .audio-settings .delay-value').innerHTML = sec.toFixed(1) + 's';
      });
    });

    component.querySelector('.upload-button').addEventListener('click', () => {
      UploadMedia.renderUploadForm(currentVideoId);
      TrackList.removeTrackList();
    });
  },
};

export default TrackList;
