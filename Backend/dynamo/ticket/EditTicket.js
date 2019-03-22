var AWS = require('aws-sdk');
AWS.config.update({ region: 'ap-southeast-1' });
module.exports.EditTicket = (event, context, callback) => {
    var docClient = new AWS.DynamoDB.DocumentClient();
    console.log(event);

    var box = {
        Tickets_ID: event.body.Tickets_ID,
        Tickets_Opentime: event.body.Tickets_Opentime,
        Tickets_Engineering: event.body.Tickets_Engineering,
        Tickets_Owner: event.body.Tickets_Owner,
        Tickets_Resource: event.body.Tickets_Resource,
        Tickets_TakeAction: event.body.Tickets_TakeAction,
        P_NAME: event.body.P_NAME,
        CUS_NAME: event.body.CUS_NAME,
        Tickets_Closetime: event.body.Tickets_Closetime,
    }
    console.log("Box :", box);

    docClient.update({
        TableName: "TICKETS",
        Key: { Tickets_ID: box.Tickets_ID },
        ExpressionAttributeValues: {
            ":Tickets_Opentime": box.Tickets_Opentime,
            ":Tickets_Owner": box.Tickets_Owner,
            ":Tickets_Resource": box.Tickets_Resource,
            ":Tickets_TakeAction": box.Tickets_TakeAction,
            ":Tickets_Engineering": box.Tickets_Engineering,
            ":P_NAME": box.P_NAME,
            ":CUS_NAME": box.CUS_NAME,
            ":Tickets_Closetime": box.Tickets_Closetime,

        },
        UpdateExpression:
            `set Tickets_Opentime = :Tickets_Opentime,
            Tickets_Engineering= :Tickets_Engineering,
            Tickets_Owner = :Tickets_Owner, 
            Tickets_Resource = :Tickets_Resource, 
            Tickets_TakeAction = :Tickets_TakeAction,
            P_NAME = :P_NAME,
            CUS_NAME = :CUS_NAME,
            Tickets_Closetime = :Tickets_Closetime`
    }, (err, data) => {
        if (err) {
            // console.log('Update', err.message)
            callback(null, { status: 400, err });
        }
        else {
            // console.log('Success', data);
            var status = "Edited it"
            callback(null, { status: 200, status });
        }
    })
}