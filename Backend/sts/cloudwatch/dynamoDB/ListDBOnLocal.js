var AWS = require('aws-sdk')
var requestSTS = require('../../requestSTS').requestSTS;

module.exports.listDynDB = async (event, context, callback) => {
    // const listec2 = async (event) => {
    console.log('event: ', event)
    var temp = {
        accessKeyId: event.body.accessKeyId,
        secretAccessKey: event.body.secretAccessKey,
        sessionToken: event.body.sessionToken,
        accountID: event.body.accountID
    }
    var res = await requestSTS(temp)
    var data = await ListDB(res.message.Credentials);
    var temp = [];

    for (let i = 0; i < data.TableNames.length; i++) {
        temp.push({
            Description: await DescriptionDB(data.TableNames[i], res.Credentials)
        });
    }
    var response = [];
    for (let j = 0; j < temp.length; j++) {
        // for (let k = 0; k < temp.length; k++) {
            response.push({
                TableName: temp[j].Description.data.Table.TableName,
                TableId: temp[j].Description.data.Table.TableId,
                TableSizeBytes: temp[j].Description.data.Table.TableSizeBytes,
                ItemCount: temp[j].Description.data.Table.ItemCount,
                TableStatus: temp[j].Description.data.Table.TableStatus,
                ReadCapacityUnits: temp[j].Description.data.Table.ProvisionedThroughput.ReadCapacityUnits,
                WriteCapacityUnits: temp[j].Description.data.Table.ProvisionedThroughput.WriteCapacityUnits

            });
        // }
    }
    callback(null, response)




}

var ListDB = (credentials) => {
    return new Promise(resolve => {

        var params = {/*TableName: "PROJECTF"*/ };
        new AWS.DynamoDB({
            // region: 'ap-southeast-1',
            // accessKeyId: credentials.AccessKeyId,
            // secretAccessKey: credentials.SecretAccessKey,
            // sessionToken: credentials.SessionToken,
        }).listTables(params, function (err, data) {

            if (err) {
                resolve(err, credentials)
            }
            else {
                resolve(data)
                console.log(data)
            }
        })
    });
};
var DescriptionDB = (Table, credentials) => {
    return new Promise(resolve => {

        var params = { TableName: Table };
        new AWS.DynamoDB({
            // region: 'ap-southeast-1',
            // accessKeyId: credentials.AccessKeyId,
            // secretAccessKey: credentials.SecretAccessKey,
            // sessionToken: credentials.SessionToken,
        }).describeTable(params, function (err, data) {

            if (err) {
                resolve({
                    statusCode: 400,
                    err, credentials
                })
            }
            else {
                resolve({
                    statusCode: 200,
                    data
                })
                console.log(data)
            }
        })
    });
};

