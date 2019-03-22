var AWS = require('aws-sdk');

AWS.config.update({ region: 'ap-southeast-1' });

module.exports.DelAut = (event, context, callback) => {
    var docClient = new AWS.DynamoDB.DocumentClient();
    console.log(event);
    var box = {
        AU_ID: event.body.AU_ID,
        P_ID: event.body.P_ID
    }
    var params = {
        TableName: 'PROJECTF',
        Key: { P_ID: box.P_ID }
    };
    docClient.get(params, function (err, data) {
        if (err) {
            console.log("Error :", err);
            //   callback(null, { status: 400, err });
        } else {

            console.log("Data :", data)
            var target_authorized = data.Item.AUTHORIZED.findIndex(key =>
                key.AU_ID === box.AU_ID
            );
            // callback(null, { status: 200, data });

            var tmp2 = data.Item.AUTHORIZED

            delete tmp2[target_authorized]
            

            docClient.update({
                TableName: "PROJECTF",
                Key: { P_ID: box.P_ID },
                ExpressionAttributeValues: {
                    ":AUTHORIZED": tmp2,
                },
                UpdateExpression:
                    `set AUTHORIZED = :AUTHORIZED`
            }, (err, data) => {
                if (err) {
                    // console.log('Update', err.message)
                    callback(null, { status: 400, err });
                }
                else {
                    // console.log('Success', data);
                    var status = "Success"
                    callback(null, { status: 200, target_account });
                }
            })
        }
    });
}