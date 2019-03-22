var AWS = require('aws-sdk')
var requestSTS = require('../../requestSTS').requestSTS;

module.exports.ListDynDB = async (event, context, callback) => {
    // const listec2 = async (event) => {
    console.log('event: ',event)
    var temp = {
        accessKeyId: event.body.accessKeyId,
        secretAccessKey: event.body.secretAccessKey,
        sessionToken: event.body.sessionToken,
        accountID: event.body.accountID
    }
    console.log('temp :'. temp)

    var res = await requestSTS(temp)

    console.log('log :', res.message.Credentials)


    var data = await promisePlease(res.message.Credentials);
    var tmp = [];
    // for (let i = 0; i < data.DBInstances.length; i++) { // Project's loop

    //                 //     for (let j = 0; j < data.DBInstances[i].Endpoint.length; j++) { // Account's loop
                            
    //                         tmp.push({InstanceIdentifier:data.DBInstances[i].DBInstanceIdentifier,
    //                             InstanceStatus:data.DBInstances[i].DBInstanceStatus,
    //                             InstanceEndpoint:data.DBInstances[i].Endpoint.Address,
    //                             InstanceEngine:data.DBInstances[i].Engine,
    //                             EngineVersion:data.DBInstances[i].EngineVersion,
    //                             AllocatedStorage:data.DBInstances[i].AllocatedStorage,
    //                             MultiAZ:data.DBInstances[i].MultiAZ,
    //                         })
    //                 //     }
    // }
    callback(null, data)
}

var promisePlease = async (credentials) => {
    return new Promise(resolve => {

        var params = {};
        new AWS.DynamoDB({
            region: 'ap-southeast-1',
            accessKeyId: credentials.AccessKeyId,
            secretAccessKey: credentials.SecretAccessKey,
            sessionToken: credentials.SessionToken
            ,
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