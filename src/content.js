
// import AudioPlayer from './components/AudioPlayer';
// import TrackList from './components/TrackList';

function loadCSS(filename){

  var file = document.createElement("link");
  file.setAttribute("rel", "stylesheet");
  file.setAttribute("type", "text/css");
  file.setAttribute("href", filename);
  document.head.appendChild(file);
}

const getUrl = path => chrome.runtime.getURL(path);

let videoId;
let cssLoaded = false;

chrome.runtime.onMessage.addListener(function(request, sender, callback) {
  switch (request.action) {
    case 'NETFLIX_BROWSE_PAGE': {
      // AudioPlayer.removeHandlers();
      // TrackList.removeTrackList();

      if(!cssLoaded) {
        loadCSS(getUrl('fonts/icomoon.css'));
        cssLoaded = true;
      }
    } break;

    case 'NETFLIX_VIDEO_PAGE': {
      videoId = request.videoId;

      /*TrackList.renderTrackList(videoId)
        .then(() => {

        });*/

      if(!cssLoaded) {
        loadCSS(getUrl('fonts/icomoon.css'));
        cssLoaded = true;
      }
    } break;

    case 'YOUTUBE_BROWSE_PAGE': {
      if(!cssLoaded) {
        loadCSS(getUrl('fonts/icomoon.css'));
        cssLoaded = true;
      }
    } break;

    case 'YOUTUBE_VIDEO_PAGE': {
      if(!cssLoaded) {
        loadCSS(getUrl('fonts/icomoon.css'));
        cssLoaded = true;
      }
    } break;
  }

  return true;
});
