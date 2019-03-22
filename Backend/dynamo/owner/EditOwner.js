var AWS = require('aws-sdk');

AWS.config.update({ region: 'ap-southeast-1' });

module.exports.EditOwner = (event, context, callback) => {
    var docClient = new AWS.DynamoDB.DocumentClient();
    console.log(event.params);
    var box = {
        OWNER_ID: event.body.OWNER_ID,
        OWNER_NAME: event.body.OWNER_NAME,
        OWNER_TELL: event.body.OWNER_TELL,
        OWNER_EMAIL: event.body.OWNER_EMAIL,
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

            var target_owner = data.Item.OWNERS.findIndex(key =>
                key.OWNER_ID === box.OWNER_ID

            );
            console.log("Target : ", target_owner);


            docClient.update({
                TableName: "PROJECTF",
                Key: { P_ID: box.P_ID },
                ExpressionAttributeValues: {
                    ":OWNER_NAME": box.OWNER_NAME,
                    ":OWNER_TELL": box.OWNER_TELL,
                    ":OWNER_EMAIL": box.OWNER_EMAIL,
                    
                },
                UpdateExpression:
                    `set OWNERS[${target_owner}].OWNER_NAME = :OWNER_NAME,
                    OWNERS[${target_owner}].OWNER_TELL = :OWNER_TELL,
                    OWNERS[${target_owner}].OWNER_EMAIL = :OWNER_EMAIL`
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
