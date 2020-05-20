const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const http = require('http');
const https = require('https');
const privateKey  = fs.readFileSync('./key.pem', 'utf8');
const certificate = fs.readFileSync('./cert.pem', 'utf8');
const credentials = {key: privateKey, cert: certificate, passphrase: '123qwe'};

const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const httpAccessControlPolicy = require('./api/policies/httpAccessControl.policy');
const currentUserPolicy = require('./api/policies/currentUser.policy');

const backendSettings = require('./credentials/backend.settings');
const mongoSettings = require('./credentials/mongo.settings');

(async () => {
  const app = express();
  const httpsServer = https.createServer(credentials, app);

  app.use(bodyParser.json() );       // to support JSON-encoded bodies
  app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
  }));

  app.options('*', cors());

  app.use(fileUpload());

  app.use('/static', express.static('file'));

  app.use(httpAccessControlPolicy);
  app.use(currentUserPolicy);


  /*
  * Routes
  * */
  require('./api/routes/get-by-video-id')(app);
  require('./api/routes/submit-form')(app);

  /*
  * Database
  * */
  const MongoClient = require('mongodb').MongoClient;
  const client = new MongoClient(mongoSettings.url, { useUnifiedTopology: true });
  const connection = await client.connect();
  app.locals.db = connection.db(mongoSettings.dbName);

  /*
  * Listening
  * */
  httpsServer.listen(backendSettings.serverPort, () => {
    console.log(`Backend is listening on port ${backendSettings.serverPort}!`);
  });
})();








