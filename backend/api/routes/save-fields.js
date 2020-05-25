
module.exports = app => {
  app.post('/save-fields', async (req, res) => {
    const db = app.locals.db;

    const { audioName, videoId, videoType, fileName } = req.body;

    let collection;

    if(videoType === 'NETFLIX_VIDEO_PAGE') {
      collection = 'netflix-videos';
    }

    if(videoType === 'YOUTUBE_VIDEO_PAGE') {
      collection = 'youtube-videos';
    }

    const row = await db.collection(collection).findOne({ videoId });

    const audioFiles = row.audioFiles.map(item => {
      if(item.fileName === fileName) {
        item.audioName = audioName;
      }
      return item;
    });

    await db.collection(collection).updateOne({
      videoId
    }, {
      $set: {
        audioFiles,
      }
    });

    res.status(200).json({});
  });
};
