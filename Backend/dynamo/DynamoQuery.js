// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
// Set the region 
AWS.config.update({ region: 'ap-southeast-1' });

module.exports.query = (event, context, callback) => {
  // Create DynamoDB document client
  var docClient = new AWS.DynamoDB.DocumentClient();
  // console.log(event.body);
  var box = { ID: event.body.id}

  var params = {
    ExpressionAttributeValues: {
      ':s': box.ID
    },
    KeyConditionExpression: 'P_ID= :s ',
    TableName: 'PROJECTF',
  };
  // var tmp=[];
  docClient.query(params, function (err, data) {
    if (err) {
      // console.log("Error", err);
      callback(null, { status: 400, err });
    } else {
       var temp = data.Items;
      
      callback(null, { status: 200, temp });
    }
  });
}