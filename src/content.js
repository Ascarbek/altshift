import AltShift from './components/AltShift.svelte';
const browser = chrome ? chrome : firefox;
function loadCSS(filename) {
  let file = document.createElement('link');
  file.setAttribute('rel', 'stylesheet');
  file.setAttribute('type', 'text/css');
  file.setAttribute('href', filename);
  document.head.appendChild(file);
}

function loadJS(filename) {
  let file = document.createElement('script');
  file.setAttribute('crossorigin', 'anonymous');
  file.setAttribute('src', filename);
  document.head.appendChild(file);
}

const getUrl = (path) => browser.runtime.getURL(path);

let cssLoaded = false;
let component;

browser.runtime.onMessage.addListener(function (request, sender, callback) {
  switch (request.action) {
    case 'NETFLIX_BROWSE_PAGE':
    case 'YOUTUBE_BROWSE_PAGE':
      {
        if (component) {
          component.$set({
            showPlayer: false,
            videoId: '',
            videoType: '',
          });
        }
      }
      break;

    case 'NETFLIX_VIDEO_PAGE':
    case 'YOUTUBE_VIDEO_PAGE':
      {
        if (!cssLoaded) {
          loadCSS('https://cdn.altshift.cc/css/all.css');
          loadCSS('https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400;500;600&display=swap');
          cssLoaded = true;
        }

        const videoId = request.videoId;
        const id = 'alt-shift-component';

        if (!document.getElementById(id)) {
          const el = document.createElement('div');
          el.id = id;
          document.body.appendChild(el);

          component = new AltShift({
            target: el,
            props: {
              videoId,
              videoType: request.action,
              showPlayer: true,
            },
          });
        } else {
          component.$set({
            videoId,
            videoType: request.action,
            showPlayer: true,
          });
        }
      }
      break;
  }

  return true;
});
