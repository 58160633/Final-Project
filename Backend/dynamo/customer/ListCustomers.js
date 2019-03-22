var AWS = require('aws-sdk');
// Set the region 
AWS.config.update({ region: 'ap-southeast-1' });

module.exports.ListCus = (event, context, callback) => {
    
    var ddb = new AWS.DynamoDB.DocumentClient();

    var params = {
        TableName: "CUSTOMERS",
        ProjectionExpression: "ID_CUS, CUS_SALE, NAME_CUS",
    };

    ddb.scan(params, function (err, data) {
        if (err) {
            console.log("Error", err);
        }
        else {

            let temp = [];

            callback(null, { status: 200, data });

        }
    });
}