const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const archiver = require('archiver');
const path = require('path');
const manifest = require('../public/manifest.json');

(async () => {
  const ARCHIVE_NAME = 'archive.zip'

  const [apiKey, secret] = process.argv.slice(2);

  await archive('../public', ARCHIVE_NAME);
  const token = createToken(apiKey, secret);
  await upload(token, path.join(__dirname, ARCHIVE_NAME), manifest.version);
})();

function createToken(apiKey, secret) {
  console.log('creating token...');
  const issuedAt = Math.floor(Date.now() / 1000);
  const payload = {
    iss: apiKey,
    jti: Math.random().toString(),
    iat: issuedAt,
    exp: issuedAt + 60,
  };

  return jwt.sign(payload, secret, {
    algorithm: 'HS256', // HMAC-SHA256 signing algorithm
  });
}

async function archive(buildFolder, zipName) {
  console.log('archiving...');
  const output = fs.createWriteStream(path.join(__dirname, zipName));
  const archive = archiver('zip', {
    zlib: {level: 9},
  });

  archive.pipe(output);

  const allFiles = fs.readdirSync(path.join(__dirname, buildFolder));
  allFiles
    .filter((file) => fs.statSync(path.join(__dirname, buildFolder, file)).isFile())
    .forEach((file) => {
      archive.append(fs.createReadStream(path.join(__dirname, buildFolder, file)), {name: file});
    });

  allFiles
    .filter((file) => fs.statSync(path.join(__dirname, buildFolder, file)).isDirectory())
    .forEach((dir) => {
      archive.directory(path.join(__dirname, buildFolder, dir), dir);
    })

  await archive.finalize();
}

async function upload(token, filePath, version) {
  console.log('uploading...');
  const file = fs.createReadStream(filePath);
  const formData = new FormData();
  formData.append('upload', file);
  formData.append('version', version);
  const resp = await axios.post('https://addons.mozilla.org/api/v5/addons/', formData, {
    headers: {
      ...formData.getHeaders(),
      Authorization: `JWT ${token}`,
    },
  })
  console.log('uploaded');
  console.log(resp.data);
}

