var uuid = require('uuid')
var AWS = require('aws-sdk')
var s3 = new AWS.S3();
AWS.config.update({region: 'ap-southeast-1'})

async function putImage (file) {
  var fileName = (file.type == "image/jpg" || file.type == "image/jpeg") ?
    uuid() + ".jpg": uuid() + ".png";

  const params = {
    ACL: 'public-read',
    Body: file.file,
    Bucket: 'sentinel-image',
    ContentType: file.type,
    Key: `Diagram/${file.projectId}/${fileName}`
  };

  return new Promise((resolve) => {
    s3.putObject(params, async function (err, data) {
      if (err) { 
        console.log(err, err.stack); // an error occurred 
        resolve(err);
      } else { 
        // console.log(data); 
        resolve(`https://s3-ap-southeast-1.amazonaws.com/sentinel-image/Diagram/${file.projectId}/${fileName}`);
      }
    });
  });
}

module.exports = { putImage }