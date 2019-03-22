var AWS = require('aws-sdk');
AWS.config.update({ region: 'ap-southeast-1' });
module.exports.GetTicket = (event, context, callback) => {
    // var id = event.body.id

    var params = {
        TableName: 'TICKETS',
        // FilterExpression: 'P_ID = :P_ID',
        // ExpressionAttributeValues: { ':P_ID': id }
    };

    var documentClient = new AWS.DynamoDB.DocumentClient();

    return new Promise((resolve) => {
        documentClient.scan(params, function (err, data) {
            if (err) {
                console.log(err);
                callback(null, { Status: 400, err });
            }
            else {
                console.log(data);
                var ticket = data.Items
                callback(null, { Status: 200, ticket});
            }
        });
    });
}