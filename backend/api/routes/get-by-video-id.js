
module.exports = function(app) {
  app.get('/get-by-video-id', async (req, res) => {
    const videoId = req.query.videoId;
    const db = app.locals.db;

    const row = await db.collection('netflix-videos').findOne({ videoId });

    if(row && row.audioFiles.length) {
      res.status(200).json({audioFiles: row.audioFiles});
    } else {
      res.status(200).json({audioFiles: []});
    }
  });

};
