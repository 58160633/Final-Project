//Add Project
var AWS = require('aws-sdk');
const uuidv1 = require('uuid/v1');
var moment = require('moment');
// Set the region 
AWS.config.update({ region: 'ap-southeast-1' });

module.exports.insert = (event, context, callback) => {
  var docClient = new AWS.DynamoDB.DocumentClient();
  var y = Math.floor((Math.random() * 99) + 1);
  var x = Math.floor((Math.random() * 99) + 1);
  // console.log(y);
  const v1options = {
    node: [x, 0x23, 0x45, y, 0x89, 0xab],
    clockseq: 0x1234,
    msecs: new Date().getTime(),
    nsecs: 9999
  };

  var R_P_ID = uuidv1(v1options);


  var box = {

    P_ID: event.body.project.project_name + "-" + R_P_ID,
    P_CODE: event.body.project.project_code,
    P_NAME: event.body.project.project_name,
    P_DateStart: event.body.project.project_datestart,
    P_DateEnd: event.body.project.project_dateend,
    P_Stage: event.body.project.stage,
    P_Sale: event.body.project.project_sale,
    LAST_UPDATE: moment(Date.now()).format("YYYY-MM-DD HH:mm"),
    ACCOUNT: [],
    AUTHORIZED: [],
    DIAGRAME: [],
    OWNERS: [],
    // TICKET: []

  }
  var ID_CUS = event.body.project.ID_CUS
  var params = {
    TableName: 'PROJECTF',
    Item: box
  }

  docClient.put(params, function (err, data) {
    if (err) {
      console.log("Error", err);
      // callback(null, err)
    } else {
      console.log("Success", box);
      // callback(null, { status: 200, box })
    }
  });
  var params2 = {
    TableName: 'CUSTOMERS',
    Key: { "ID_CUS": ID_CUS }
  };
  docClient.get(params2, function (err, data) {
    if (err) {
      console.log("Error :", err);
      //   callback(null, { status: 400, err });
    } else {
      
      console.log("Data :", data)
      // callback(null, { status: 200, data });

      var tmp2 = data.Item.PROJECTS
      console.log("tmp", tmp2)
      tmp2.push({ P_ID: box.P_ID, P_NAME: box.P_CODE, P_Stage: box.P_Stage})

      docClient.update({
        TableName: "CUSTOMERS",
        Key: { ID_CUS: ID_CUS },
        ExpressionAttributeValues: {
          ":PROJECT": tmp2,
        },
        UpdateExpression:
          `set PROJECTS = :PROJECT`
      }, (err, data) => {
        if (err) {
          // console.log('Update', err.message)
          callback(null, { status: 400, err });
        }
        else {
          // console.log('Success', data);
          var status = "Success"
          callback(null, { status: 200, status });
        }
      })
    }
  });
}
