const path = require('path');
const randomString = require('randomstring');

module.exports = app => {
  app.post('/submit-form', async (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send('No files were uploaded.');
    }

    const db = app.locals.db;

    let trackFile = req.files.trackFile;

    const { videoId, videoType } = req.body;

    const fileName = randomString.generate() + path.extname(trackFile.name);

    await new Promise(((resolve, reject) => trackFile.mv(`./file/${fileName}`, err => err ? reject(err) : resolve())));

    console.log(`file ${videoId}${path.extname(trackFile.name)} received and saved as ${fileName}`);

    let collection;

    if(videoType === 'NETFLIX_VIDEO_PAGE') {
      collection = 'netflix-videos';
    }

    if(videoType === 'YOUTUBE_VIDEO_PAGE') {
      collection = 'youtube-videos';
    }

    const row = await db.collection(collection).findOne({ videoId });

    if (!row) {
      await db.collection(collection).insertOne({
        videoId,
        audioFiles: [{
          fileName,
          tags: [],
        }]
      });
    }
    else {
      const audioFiles = [...row.audioFiles, { fileName }];
      await db.collection(collection).updateOne({
        videoId
      }, {
        $set: {
          audioFiles,
        }
      });
    }

    res.status(200).json({ fileName });
  });
};
