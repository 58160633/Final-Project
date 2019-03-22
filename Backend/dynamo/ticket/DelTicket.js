// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
var docClient = new AWS.DynamoDB.DocumentClient();

// Set the region 
AWS.config.update({ region: 'ap-southeast-1' });
module.exports.DelTicket = async (event, context, callback) => {

  console.log(event);
  var box = { Tickets_ID : event.body.id }

  var params = {
    TableName: 'TICKETS',
    Key: box
  };

  return new Promise((resolve) => {
    docClient.delete(params, function (err, data) {
      if (err) {
        console.log("Error", err);
        // resolve(err)
        callback(null, { Status: 400, err });

      } else {
        console.log("Success", data);
        // resolve("Success")
        var Stage = "Delete success"
        callback(null, { Status: 200, Stage} );
      }
    });
  })
}