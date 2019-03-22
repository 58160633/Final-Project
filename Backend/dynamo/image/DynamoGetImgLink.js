var AWS = require('aws-sdk');
AWS.config.update({ region: 'ap-southeast-1' });

module.exports.DGIL = (event, context, callback) => {
    // Create DynamoDB document client
    var docClient = new AWS.DynamoDB.DocumentClient();
    console.log(event);
    var box = { ID: event.body.id}
    console.log("BOX ::",box);

    var params = {
        TableName: 'PROJECTF',
        Key: { "P_ID":  box.ID},
    };
    docClient.get(params, function (err, data) {
        if (err) {
            // console.log("Error : ", err);
            callback(null, { status: 400, err });
        } else {
            // console.log("Data : ", data);
            var tmp = data.Item.DIAGRAM
            callback(null, { status: 200,tmp});
        }
    });
}