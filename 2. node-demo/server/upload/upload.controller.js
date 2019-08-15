const upyun = require('upyun');
const moment = require('moment');
const mime = require('mime');
const { upyun: upyunConfig } = require('../../config/config');

const service = new upyun.Service(
  upyunConfig.bucketName,
  upyunConfig.operator,
  upyunConfig.password
);

const client = new upyun.Client(service);

function upload(req, res, next) {
  const files = req.files;
  const isCkEditor = req.query.isCkEditor;
  let parentDir = `/store2/${moment().format('YYYY-MM-DD')}`;
  const fileNames = [];
  Promise.all(files.map(file => {
    const fileName = `${Date.now()}.${mime.getExtension(file.mimetype)}`;
    fileNames.push(fileName);
    const path = `${parentDir}/${fileName}`;
    return client.putFile(path, file.buffer);
  }))
    .then(results => {
      if (isCkEditor) {
        res.send({
          uploaded: 1,
          url: `${upyunConfig.serverPrefix}${parentDir}/${fileNames[0]}`
        });
      } else {
        req.result = fileNames.map(n => ({
          url: `${upyunConfig.serverPrefix}${parentDir}/${n}`
        }));
        next();
      }
    })
    .catch(next);
}

module.exports = { upload };
