var AWS = require('aws-sdk');
 
AWS.config.update({ region: 'ap-southeast-1' });

module.exports.ListP = (event, context, callback) => {

  var docClient = new AWS.DynamoDB.DocumentClient();
  // console.log(event.body);
  var box = { ID: event.body.id}

  var params = {
        TableName: 'CUSTOMERS',
        Key: { "ID_CUS":  box.ID},
  };
  
  docClient.get(params, function (err, data) {
    if (err) {
      // console.log("Error :", err);
      callback(null, { status: 400, err });
    } else {
      var Projects = data.Item.PROJECTS
      // console.log("Data :", data);
      callback(null, { status: 200, Projects });
    }
  });
}