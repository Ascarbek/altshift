
module.exports = function(app) {
  app.get('/get-by-video-id', async (req, res) => {
    const { videoId, videoType } = req.query;

    const db = app.locals.db;

    let collection;

    if(videoType === 'NETFLIX_VIDEO_PAGE') {
      collection = 'netflix-videos';
    }

    if(videoType === 'YOUTUBE_VIDEO_PAGE') {
      collection = 'youtube-videos';
    }

    const row = await db.collection(collection).findOne({ videoId });

    if(row && row.audioFiles.length) {
      res.status(200).json({audioFiles: row.audioFiles});
    } else {
      res.status(200).json({audioFiles: []});
    }
  });

};
