var AWS = require('aws-sdk');

AWS.config.update({ region: 'ap-southeast-1' });

module.exports.DelOwner = (event, context, callback) => {
    var docClient = new AWS.DynamoDB.DocumentClient();
    console.log("event :",event.query);
    var box = {
        OWNER_ID: event.query.OWNER_ID,
        P_ID: event.query.P_ID
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
            var target_owner = data.Item.OWNERS.findIndex(key =>
                key.OWNER_ID === box.OWNER_ID
            );
            // callback(null, { status: 200, data });

            var tmp2 = data.Item.OWNERS

            delete tmp2[target_owner]
            

            docClient.update({
                TableName: "PROJECTF",
                Key: { P_ID: box.P_ID },
                ExpressionAttributeValues: {
                    ":OWNERS": tmp2,
                },
                UpdateExpression:
                    `set OWNERS = :OWNERS`
            }, (err, data) => {
                if (err) {
                    // console.log('Update', err.message)
                    callback(null, { status: 400, err });
                }
                else {
                    // console.log('Success', data);
                    var status = "Success"
                    callback(null, { status: 200, target_owner });
                }
            })
        }
    });
}