var AWS = require('aws-sdk');
const uuidv1 = require('uuid/v1');

AWS.config.update({ region: 'ap-southeast-1' });

module.exports.AddOwner = (event, context, callback) => {
    var docClient = new AWS.DynamoDB.DocumentClient();
    var y = Math.floor((Math.random() * 99) + 1);
    var x = Math.floor((Math.random() * 99) + 1);
    console.log(event);
    const v1options = {
        node: [0x23, x, 0x45, y, 0x89, 0xab],
        clockseq: 0x1234,
        msecs: new Date().getTime(),
        nsecs: 9999
    };

    var R_OWNER_ID = uuidv1(v1options);
    console.log(event);
    var box = {
        OWNER_ID: R_OWNER_ID,
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

            // callback(null, { status: 200, data });
            
            var tmp2 = data.Item.OWNERS
            
            tmp2.push({ OWNER_ID: box.OWNER_ID, OWNER_NAME: box.OWNER_NAME, OWNER_TELL : box.OWNER_TELL, OWNER_EMAIL : box.OWNER_EMAIL })
            console.log("DataGet :", tmp2)
            
            docClient.update({
                TableName: "PROJECTF",
                Key: { P_ID: box.P_ID },
                ExpressionAttributeValues: {
                    ":owner": tmp2,
                },
                UpdateExpression:
                `set OWNERS = :owner`
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
