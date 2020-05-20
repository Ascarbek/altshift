const path = require('path');
const randomString = require('randomstring');

module.exports = app => {
  app.post('/submit-form', function (req, res) {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send('No files were uploaded.');
    }

    let trackFile = req.files.trackFile;
    let videoId = req.body.videoId;
    let audioName = req.body.audioName;
    let lang = req.body.lang;
    let fileName = randomString.generate() + path.extname(trackFile.name);

    trackFile.mv(`./file/${fileName}`, async (err) => {
      if (err)
        return res.status(500).send(err);

      console.log(`file ${videoId}${path.extname(trackFile.name)} received and saved as ${fileName}`);

      const db = app.locals.db;

      const row = await db.collection('netflix-videos').findOne({ videoId });

      if(!row) {
        await db.collection('netflix-videos').insertOne({
          videoId,
          audioFiles: [{
            audioName,
            lang,
            fileName,
          }]
        });
      } else {
        const newFile = {
          audioName,
          lang,
          fileName,
        };
        const audioFiles = [...row.audioFiles, {...newFile}];
        await db.collection('netflix-videos').updateOne({
          videoId
        }, {
          $set: {
            audioFiles,
          }
        });
      }

      res.send('File uploaded!');
    });
  });
};
