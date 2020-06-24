module.exports = app => {
  app.post('/save-audio-file', async (req, res) => {
    const {
      videoId,
      videoType,
      audioFileName,
      audioName,
      lang,
      tags,
    } = req.body;

    const db = app.locals.db;

    let collection;

    if(videoType === 'NETFLIX_VIDEO_PAGE') {
      collection = 'netflix-videos';
    }

    if(videoType === 'YOUTUBE_VIDEO_PAGE') {
      collection = 'youtube-videos';
    }

    const row = await db.collection(collection).findOne({ videoId });
    const audioFiles = row.audioFiles;
    await db.collection(collection).updateOne({
      videoId
    }, {
      $set: {
        audioFiles: [...audioFiles.map(file => {
          if(audioFileName === file.fileName) {
            return {
              ...file,
              audioName,
              lang,
              tags: tags.map(t => t.label),
            }
          }
          else {
            return file;
          }
        })]
      }
    });

    const newTags = tags.filter(t => t.isNew);
    for(let i=0; i<newTags.length; i++) {
      const tag = newTags[i];
      await db.collection('tags').insertOne({
        label: tag.label,
      });
    }

    res.status(200).json({});
  });
};
