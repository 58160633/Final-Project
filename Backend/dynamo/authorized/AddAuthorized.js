var AWS = require('aws-sdk');
const uuidv1 = require('uuid/v1');

AWS.config.update({ region: 'ap-southeast-1' });

module.exports.AddAut = (event, context, callback) => {
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

    var R_AU_ID = uuidv1(v1options);
    console.log(event);
    var box = {
        AU_ID: R_AU_ID,
        AU_NAME: event.data.AU_NAME,
        AU_TELL: event.data.AU_TELL,
        AU_EMAIL: event.data.AU_EMAIL,
        P_ID: event.data.P_ID
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

            var tmp2 = data.Item.AUTHORIZED

            tmp2.push({ AU_ID: box.AU_ID, AU_NAME: box.AU_NAME, AU_TELL : box.AU_TELL, AU_EMAIL : box.AU_EMAIL })

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
                    callback(null, { status: 200, status });
                }
            })
        }
    });
}
