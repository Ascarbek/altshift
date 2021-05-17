// URL change event handler
const browser = chrome ? chrome : firefox;
browser.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  // handle root url
  let netflixMatch = tab.url.match(/^https:\/\/www\.netflix\.com/);
  let youtubeMatch = tab.url.match(/^https:\/\/www\.youtube\.com/);

  if (netflixMatch && netflixMatch.length > 0) {
    // enable icon
    // chrome.action.show(tabId);

    // handle watch page
    let watchPageMatch = tab.url.match(/^https:\/\/www\.netflix\.com\/watch\/([\w\-]+)/);
    if (watchPageMatch && watchPageMatch.length > 1) {
      // get video id
      let videoId = watchPageMatch[1];

      // start track
      browser.tabs.sendMessage(tab.id, { action: 'NETFLIX_VIDEO_PAGE', videoId });
    } else {
      // initialize content script
      browser.tabs.sendMessage(tab.id, { action: 'NETFLIX_BROWSE_PAGE' });
    }
  } else if (youtubeMatch && youtubeMatch.length > 0) {
    // chrome.action.show(tabId);

    let watchPageMatch = tab.url.match(/^https:\/\/www\.youtube\.com\/watch\?v=([\w\-]+)/);
    if (watchPageMatch && watchPageMatch.length > 1) {
      // get video id
      let videoId = watchPageMatch[1];

      // start track
      browser.tabs.sendMessage(tab.id, { action: 'YOUTUBE_VIDEO_PAGE', videoId });
    } else {
      // initialize content script
      browser.tabs.sendMessage(tab.id, { action: 'YOUTUBE_BROWSE_PAGE' });
    }
  } else {
    // chrome.action.hide(tabId);
  }
});
