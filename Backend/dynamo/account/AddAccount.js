var AWS = require('aws-sdk');

AWS.config.update({ region: 'ap-southeast-1' });

module.exports.AddA = (event, context, callback) => {
    var docClient = new AWS.DynamoDB.DocumentClient();
    console.log(event);
    var box = {
        A_ID: event.body.accountID,
        A_NAME: event.body.A_NAME,
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

            var tmp2 = data.Item.ACCOUNT

            tmp2.push({ A_ID: box.A_ID, A_NAME: box.A_NAME })

            docClient.update({
                TableName: "PROJECTF",
                Key: { P_ID: box.P_ID },
                ExpressionAttributeValues: {
                    ":ACCOUNT": tmp2,
                },
                UpdateExpression:
                    `set ACCOUNT = :ACCOUNT`
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
