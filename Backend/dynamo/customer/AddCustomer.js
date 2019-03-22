var AWS = require('aws-sdk');
const uuidv1 = require('uuid/v1');

AWS.config.update({ region: 'ap-southeast-1' });
module.exports.AddCus = (event, context, callback) => {
    console.log("Body", event.body)
    var docClient = new AWS.DynamoDB.DocumentClient();
    var x = Math.floor((Math.random() * 99) + 1);
    var y = Math.floor((Math.random() * 99) + 1);
    var z = Math.floor((Math.random() * 99) + 1);
    // console.log(y);
    const v1options = {
        node: [0x01, x, y, z, 0x89, 0xab],
        clockseq: 0x1234,
        msecs: new Date().getTime(),
        nsecs: 9999
    };

    var CUS_R_ID = event.body.customerAdd.NAME_CUS + "-" + uuidv1(v1options);

    var box = {

        ID_CUS: CUS_R_ID,
        NAME_CUS: event.body.customerAdd.NAME_CUS,
        CUS_SALE: event.body.customerAdd.CUS_SALE,
        PROJECTS:[]
    }
    var params = {
        TableName: 'CUSTOMERS',
        Item: box
    }

    docClient.put(params, function (err, data) {
        if (err) {
            console.log("Error", err);
            callback(null, err)
        } else {
            console.log("Success", box);
            callback(null, { status: 200, box })
        }
    });
}
