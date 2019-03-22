// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
// Set the region 
AWS.config.update({ region: 'ap-southeast-1' });

// Create DynamoDB service object
module.exports.scan = (event, context, callback) => {
  // function main() {

  // console.log(event);
  var ddb = new AWS.DynamoDB.DocumentClient();

  var params = {
    // Set the table's name
    TableName: "PROJECTF",
    // ExpressionAttributeValues: {
    //   ":o":event.x
    //  }, 
    // Select attributes
    ProjectionExpression: "P_ID, ACCOUNT, CUS_NAME, P_CODE, P_Stage, P_Owner, CUS_TELL, CUS_EMAIL, P_NAME",
    // FilterExpression: "P_Owner = :o",

  };

  ddb.scan(params, function (err, data) {
    if (err) {
      console.log("Error", err);
    }
    else {

      let temp = [];
      for (let i = 0; i < data.Items.length; i++) { // Project's loop

        for (let j = 0; j < data.Items[i].ACCOUNT.length; j++) { // Account's loop
          temp.push({
            P_ID: data.Items[i].P_ID,
            A_NAME: data.Items[i].ACCOUNT[j].A_NAME,
            A_ID: data.Items[i].ACCOUNT[j].A_ID,
            CUS_NAME: data.Items[i].CUS_NAME,
            P_NAME: data.Items[i].P_NAME,
            P_CODE: data.Items[i].P_CODE,
            P_Stage: data.Items[i].P_Stage,
            P_Owner: data.Items[i].P_Owner,
            CUS_TELL: data.Items[i].CUS_TELL,
            CUS_EMAIL: data.Items[i].CUS_EMAIL
          })
        }

      }

      // console.log(temp)
      callback(null, { status: 200, temp });

    }
  });
}

// main();