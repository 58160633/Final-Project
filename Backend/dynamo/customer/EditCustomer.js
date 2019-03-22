var AWS = require('aws-sdk');
AWS.config.update({ region: 'ap-southeast-1' });
module.exports.EditCus = (event, context, callback) => {
    var docClient = new AWS.DynamoDB.DocumentClient();;

    var keybox = {
        ID_CUS: event.body.customer.id,
        NAME_CUS: event.body.customer.NAME_CUS,
        CUS_SALE: event.body.customer.CUS_SALE,
    
    }
    console.log(keybox);

    docClient.update({
        TableName: "CUSTOMERS",
        Key: { ID_CUS: keybox.ID_CUS },
        ExpressionAttributeValues: {
            ":N": keybox.NAME_CUS,
            ":S": keybox.CUS_SALE
        },
        UpdateExpression:
            `set NAME_CUS= :N, CUS_SALE= :S`
    }, (err, data) => {
        if (err) {
            // console.log('Update', err.message)
            callback(null, { status: 400, err });

        }
        else {
            // console.log('Success', data);
            callback(null, { status: 200, keybox });
        }
    })
}