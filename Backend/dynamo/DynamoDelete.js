// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
var docClient = new AWS.DynamoDB.DocumentClient();

// Set the region 
AWS.config.update({ region: 'ap-southeast-1' });
module.exports.delete = async (event, context, callback) => {

  console.log(event);
  var box = {
    P_ID: event.query.id,
    ID_CUS: event.query.id_cus
  }

  var params = {
    TableName: 'PROJECTF',
    Key: { P_ID: box.P_ID }
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
        // callback(null, { Status: 200, Stage });
      }
    });

    var params2 = {
      TableName: 'CUSTOMERS',
      Key: { ID_CUS: box.ID_CUS }
    };
    // var tmp=[];
    docClient.get(params2, function (err, data) {
      if (err) {
        console.log("Error :", err);
        //   callback(null, { status: 400, err });

      } else {
        var tempdata = data.Item.PROJECTS
        console.log("TempData :", tempdata);

        var target_project = data.Item.PROJECTS.findIndex(key =>
          key.P_ID === box.P_ID

        );
        console.log("Taget : ", target_project);

        delete tempdata[target_project]

        console.log("TempData :", tempdata)

        docClient.update({
          TableName: "CUSTOMERS",
          Key: { ID_CUS: box.ID_CUS },
          ExpressionAttributeValues: {
            ":D": tempdata
          },
          UpdateExpression:
            `set PROJECTS= :D`
        }, (err, data) => {
          if (err) {
            // console.log('Update', err.message)
            callback(null, { status: 400, err });

          }
          else {
            // console.log('Success', data);
            callback(null, { status: 200, data });
          }
        })
      }
    });
  })

}