//Add Project
var AWS = require('aws-sdk');
const uuidv1 = require('uuid/v1');
// Set the region 
AWS.config.update({ region: 'ap-southeast-1' });

module.exports.DelTicket = (event, context, callback) => {
    var docClient = new AWS.DynamoDB.DocumentClient();
    var y = Math.floor((Math.random() * 99) + 1);
    var x = Math.floor((Math.random() * 99) + 1);
    var z = Math.floor((Math.random() * 99) + 1);
    // console.log(y);
    const v1options = {
        node: [x, 0x23, 0x45, y, 0xad, z],
        clockseq: 0x1234,
        msecs: new Date().getTime(),
        nsecs: 9999
    };

    var R_T_ID = uuidv1(v1options);


    var box = {

        P_ID: event.body.P_ID,
        Tickets_ID: R_T_ID,
        Tickets_Engineering: event.body.Tickets_Engineering,
        Tickets_Opentime: event.body.Tickets_Opentime,
        Tickets_Owner: event.body.Tickets_Owner,
        Tickets_Resource: event.body.Tickets_Resource,
        Tickets_TakeAction: event.body.Tickets_TakeAction,
        P_NAME: event.body.P_NAME,
        CUS_NAME: event.body.CUS_NAME,
        Tickets_Closetime: event.body.Tickets_Closetime,

    }

    var params = {
        TableName: 'TICKETS',
        Item: box
    }

    docClient.put(params, function (err, data) {
        if (err) {
            console.log("Error", err);
            callback(null, { status: 400, err })
        } else {
            console.log("Success", box);
            callback(null, { status: 200, box })
        }
    });

}
