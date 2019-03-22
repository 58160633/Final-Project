var AWS = require('aws-sdk');
const uuidv1 = require('uuid/v1');
AWS.config.update({ region: 'ap-southeast-1' });
async function bot() {
    var array = []
    for (let i = 0; i < 5; i++) {
        put(i)
        await array.push[{id:`BotTest${i}`}]
    }
    // for (let index = 0; index < array.length; index++) {
    //     del(`BotTest${index}`)
        
    // }
    console.log(array);
    
}
function put(index) {
    var docClient = new AWS.DynamoDB.DocumentClient();
    var y = Math.floor((Math.random() * 99) + 1);

    const v1options = {
        node: [0x01, 0x23, 0x45, y, 0x89, 0xab],
        clockseq: 0x1234,
        msecs: new Date().getTime(),
        nsecs: 9999
    };
    const v2options = {
        node: [0x01, 0x23, 0x45, 0xdf, y, 0xab],
        clockseq: 0x1234,
        msecs: new Date().getTime(),
        nsecs: 9999
    };
    var R_P_ID = uuidv1(v1options);
    var R_C_ID = uuidv1(v2options);
    var i = index
    var box = {

        P_ID: `BotTest${i}`,
        P_CODE: 'Code',
        P_NAME: 'Bot na kub',
        P_DateStart: 'DS',
        P_DateEnd: 'DE',
        P_Stage: 'Stage',
        P_Sale: 'Sale',
        // P_Owner: 'Owner',
        CUS_NAME: "C'Name",
        CUS_EMAIL: "C'mail",
        CUS_TELL: "C'Tell",
        ACCOUNT: [{ A_NAME: 'MFU', A_ID: '427303592433' }],
        AUTHORIZED: [{ CON_ID: R_C_ID, CON_NAME: "Con'Name", CON_EMAIL: "Con'mail", CON_TELL: "Con'tell" },],
        DIAGRAMs: [],
        OWNERS:[]


    }
    var params = {
        TableName: 'PROJECTF',
        Item: box
    }

    docClient.put(params, function (err, data) {
        if (err) {
            console.log("Error");

        } else {
            console.log("Success", `BotTest${i}`);

        }
    });
}
function del(ID) {


    var box = { P_ID: ID }

    var params = {
        TableName: 'PROJECTF',
        Key: box
    };

    var docClient = new AWS.DynamoDB.DocumentClient();
    return new Promise((resolve) => {
        docClient.delete(params, function (err, data) {
            if (err) {
                console.log("Error");

            } else {
                console.log("Success", box);
            }
        });
    })
}
bot();