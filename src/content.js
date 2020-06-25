import AltShift from './components/AltShift.svelte';

function loadCSS(filename){
  let file = document.createElement("link");
  file.setAttribute("rel", "stylesheet");
  file.setAttribute("type", "text/css");
  file.setAttribute("href", filename);
  document.head.appendChild(file);
}

function loadJS(filename) {
  let file = document.createElement("script");
  file.setAttribute("crossorigin", "anonymous");
  file.setAttribute("src", filename);
  document.head.appendChild(file);
}

const getUrl = path => chrome.runtime.getURL(path);

let cssLoaded = false;
let component;

chrome.runtime.onMessage.addListener(function(request, sender, callback) {
  switch (request.action) {
    case 'NETFLIX_BROWSE_PAGE':
    case 'YOUTUBE_BROWSE_PAGE': {
      if(component) {
        component.$set({
          showOverlay: false,
        });
      }
    } break;

    case 'NETFLIX_VIDEO_PAGE':
    case 'YOUTUBE_VIDEO_PAGE': {
      if(!cssLoaded) {
        loadJS("https://kit.fontawesome.com/db24c30af8.js");
        loadCSS(getUrl('bundle.css'));
        loadCSS("https://fonts.googleapis.com/css2?family=Roboto+Mono&display=swap");
        cssLoaded = true;
      }

      const videoId = request.videoId;
      const id = 'alt-shift-component';

      if(!document.getElementById(id)) {
        const el = document.createElement('div');
        el.id = id;
        document.body.appendChild(el);

        component = new AltShift({
          target: el,
          props: {
            videoId,
            videoType: request.action,
            showOverlay: true,
          }
        });
      }
      else {
        component.$set({
          videoId,
          videoType: request.action,
          showOverlay: true,
        });
      }
    } break;
  }

  return true;
});
