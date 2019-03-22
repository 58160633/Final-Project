var AWS = require('aws-sdk');
var s3 = new AWS.S3();
AWS.config.update({region: 'ap-southeast-1'});

async function listObjects() {
  var params = {
    Bucket: "proud-test-s3", 
    MaxKeys: 1000000
  };

  return new Promise((resolve) => {
    s3.listObjects(params, function(err, data) {
      if (err) {
        resolve([]);
      } else {
        resolve(data);
      }
    });
  });
}

async function getObject(accountID, fileName) {

  var params = {
    Bucket: "proud-test-s3",
    Key: fileName
  }

  console.log("params ===>", params);

  return new Promise((resolve) => {
    s3.getObject(params, async function(err, data) {
        if (err) {
          console.log(err, err.stack);
          resolve(err)
        } else {
          console.log(data);
          var result = [];
          if (data.ContentLength > 0) result = JSON.parse(new Buffer(data.Body).toString("utf8"));
          // if (accountID) result = await queryLogs(result, accountID);
          if (accountID && result.length > 0) result = result.filter(item => item.accountID == accountID);
          resolve(result);
        }
      })
  });
}

async function readLogs(fileName, accountID) {
  var logs = [];
  
  if (fileName == null) {
    var listName = await listObjects();

    for (var i = 0; i < listName.Contents.length; i++) {
      if (listName.Contents[i].Key.indexOf("ApplicationLogs/") >= 0)
      logs.push(await getObject(accountID, listName.Contents[i].Key));
    }

    for (var i = 1; i < logs.length; i++) {
      logs[0] = logs[0].concat(logs[i]);
    }
    logs = logs[0];

  } else {
    logs = await getObject(accountID, fileName);
    if (logs.code == "NoSuchKey") logs = [];
  }
  return logs;
}

async function writeLogs(data) {
  data.time = new Date();
  data.time.setHours(data.time.getHours() + 7);

  var now = new Date();
  var fileName = "ApplicationLogs/" + now.getDate() + "-" + now.getMonth() + "-" + now.getFullYear() + ".json";
  
  var logs = await readLogs(fileName, null);
  console.log("before insert logs.", logs);

  logs.push(data);

  console.log("after insert logs.", logs)

  var params = {
    Bucket: "proud-test-s3", 
    Key: fileName,
    Body: JSON.stringify(logs), 
   };
   return new Promise((resolve) => {
    s3.putObject(params, function (err, data) {
      if (err) {
        console.log(err, err.stack);
        resolve(err);
      } else {
        console.log(data);
        resolve(data);
      }
    });
  });
}

module.exports = { 
  readLogs, 
  writeLogs 
}