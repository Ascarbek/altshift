module.exports = app => {
  app.get('/get-tags', async (req, res) => {
    const db = app.locals.db;

    const rows = await db.collection('tags').find({}).toArray();
    const tags = rows.map(r => { return { _id: r._id, label: r.label }});

    res.status(200).json({ tags });
  });

  app.post('/add-new-tag', async (req, res) => {
    const { videoId, videoType, audioFileName, label } = req.body;

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
          let tags = file.tags;

          if(audioFileName === file.fileName) {
            tags = [...tags, label];
          }

          return {
            fileName: file.fileName,
            tags,
          }
        })]
      }
    });

    await db.collection('tags').insertOne({
      label,
    });

    res.status(200).json({});
  });

  app.post('/toggle-tag', async (req, res) => {
    const { videoId, videoType, audioFileName, label } = req.body;

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
          let tags = file.tags;

          if(audioFileName === file.fileName) {
            if(tags.filter(t => t === label).length === 0) {
              tags.push(label);
            }
            else {
              tags.splice(tags.indexOf(label), 1);
            }
          }

          return {
            fileName: file.fileName,
            tags: [...tags],
          }
        })]
      }
    });
    res.status(200).json({});

  });

};
