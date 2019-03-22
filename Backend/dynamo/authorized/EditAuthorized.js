var AWS = require('aws-sdk');

AWS.config.update({ region: 'ap-southeast-1' });

module.exports.EditAut = (event, context, callback) => {
    var docClient = new AWS.DynamoDB.DocumentClient();
    console.log(event);
    var box = {
        AU_ID: event.body.AU_ID,
        AU_NAME: event.body.AU_NAME,
        AU_TELL: event.body.AU_TELL,
        AU_EMAIL: event.body.AU_EMAIL,
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
            // callback(null, { status: 200, data });

            var target_authorized = data.Item.AUTHORIZED.findIndex(key =>
                key.AU_ID === box.AU_ID

            );
            console.log("Target : ", target_authorized);


            docClient.update({
                TableName: "PROJECTF",
                Key: { P_ID: box.P_ID },
                ExpressionAttributeValues: {
                    ":AU_NAME": box.AU_NAME,
                    ":AU_TELL": box.AU_TELL,
                    ":AU_EMAIL": box.AU_EMAIL,
                    
                },
                UpdateExpression:
                    `set AUTHORIZED[${target_authorized}].AU_NAME = :AU_NAME,
                    AUTHORIZED[${target_authorized}].AU_TELL = :AU_TELL,
                    AUTHORIZED[${target_authorized}].AU_EMAIL = :AU_EMAIL`
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
