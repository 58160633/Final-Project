var AWS = require('aws-sdk')
var moment = require('moment')
var requestSTS = require('../../requestSTS').requestSTS;
module.exports.DdbStat = async (event, context, callback) => {
    console.log('event: ', event)
    var temp = {
        accessKeyId: event.body.accessKeyId,
        secretAccessKey: event.body.secretAccessKey,
        sessionToken: event.body.sessionToken,
        accountID: event.body.accountID,
    }
    var DBId = event.body.TableName
    var Static = 'Average'
    var TimeEnd = event.body.TimeEnd
    var TimeStart = event.body.TimeStart
    var Period = 86400

    var res = await requestSTS(temp)
;

    var data1 = await ProvisionedWriteCapacityUnits(res.message.Credentials, DBId, Static, TimeEnd, TimeStart, Period);
    console.log("data1", data1);
    var PWCU = format(data1);

    var data2 = await ProvisionedReadCapacityUnits(res.message.Credentials, DBId, Static, TimeEnd, TimeStart, Period);
    console.log("data2", data2);
    var PRCU = format(data2);

    var data3 = await ConsumedWriteCapacityUnits(res.message.Credentials, DBId, Static, TimeEnd, TimeStart, Period);
    console.log("data3", data3);
    var CWCU = format(data3);

    var data4 = await ConsumedReadCapacityUnits(res.message.Credentials, DBId, Static, TimeEnd, TimeStart, Period);
    console.log("data4", data4);
    var CRCU = format(data4);
    

    var tmp = [{ TimeStart, TimeEnd, PWCU, PRCU, CWCU, CRCU }]

    callback(null, tmp)
}
var ProvisionedWriteCapacityUnits = async (credentials, DBId, S, ET, ST, Period) => {
    return new Promise(resolve => {

        var params = {
            EndTime: ET,
            MetricDataQueries: [ /* required */
                {
                    Id: 'dbPWC001',

                    MetricStat: {
                        Metric: {
                            Dimensions: [
                                {
                                    Name: 'TableName', /* required */
                                    Value: DBId /* required */
                                },

                            ],
                            MetricName: 'ProvisionedWriteCapacityUnits',
                            Namespace: 'AWS/DynamoDB'
                        },
                        Period: Period, /* required */
                        Stat: S /* required */

                    },
                    ReturnData: true
                },

                /* more items */
            ],
            StartTime: ST,

        };
        new AWS.CloudWatch({
            // region: 'ap-southeast-1',
            // accessKeyId: credentials.AccessKeyId,
            // secretAccessKey: credentials.SecretAccessKey,
            // sessionToken: credentials.SessionToken,
        }).getMetricData(params, function (err, data) {

            if (err) {
                resolve(err)
            }
            else {
                resolve(data)
                console.log(data)
            }
        })
    });
};
var ProvisionedReadCapacityUnits = async (credentials, DBId, S, ET, ST, Period) => {
    return new Promise(resolve => {

        var params = {
            EndTime: ET,
            MetricDataQueries: [ /* required */
                {
                    Id: 'dbPWC001',

                    MetricStat: {
                        Metric: {
                            Dimensions: [
                                {
                                    Name: 'TableName', /* required */
                                    Value: DBId /* required */
                                },

                            ],
                            MetricName: 'ProvisionedReadCapacityUnits',
                            Namespace: 'AWS/DynamoDB'
                        },
                        Period: Period, /* required */
                        Stat: S /* required */

                    },
                    ReturnData: true
                },

                /* more items */
            ],
            StartTime: ST,

        };
        new AWS.CloudWatch({
            // region: 'ap-southeast-1',
            // accessKeyId: credentials.AccessKeyId,
            // secretAccessKey: credentials.SecretAccessKey,
            // sessionToken: credentials.SessionToken,
        }).getMetricData(params, function (err, data) {

            if (err) {
                resolve(err)
            }
            else {
                resolve(data)
                console.log(data)
            }
        })
    });
};
var ConsumedWriteCapacityUnits = async (credentials, DBId, S, ET, ST, Period) => {
    return new Promise(resolve => {

        var params = {
            EndTime: ET,
            MetricDataQueries: [ /* required */
                {
                    Id: 'dbPWC001',

                    MetricStat: {
                        Metric: {
                            Dimensions: [
                                {
                                    Name: 'TableName', /* required */
                                    Value: DBId /* required */
                                },

                            ],
                            MetricName: 'ConsumedWriteCapacityUnits',
                            Namespace: 'AWS/DynamoDB'
                        },
                        Period: Period, /* required */
                        Stat: S /* required */

                    },
                    ReturnData: true
                },

                /* more items */
            ],
            StartTime: ST,

        };
        new AWS.CloudWatch({
            // region: 'ap-southeast-1',
            // accessKeyId: credentials.AccessKeyId,
            // secretAccessKey: credentials.SecretAccessKey,
            // sessionToken: credentials.SessionToken,
        }).getMetricData(params, function (err, data) {

            if (err) {
                resolve(err)
            }
            else {
                resolve(data)
                console.log(data)
            }
        })
    });
};
var ConsumedReadCapacityUnits = async (credentials, DBId, S, ET, ST, Period) => {
    return new Promise(resolve => {

        var params = {
            EndTime: ET,
            MetricDataQueries: [ /* required */
                {
                    Id: 'dbPWC001',

                    MetricStat: {
                        Metric: {
                            Dimensions: [
                                {
                                    Name: 'TableName', /* required */
                                    Value: DBId /* required */
                                },

                            ],
                            MetricName: 'ConsumedReadCapacityUnits',
                            Namespace: 'AWS/DynamoDB'
                        },
                        Period: Period, /* required */
                        Stat: S /* required */

                    },
                    ReturnData: true
                },

                /* more items */
            ],
            StartTime: ST,

        };
        new AWS.CloudWatch({
            // region: 'ap-southeast-1',
            // accessKeyId: credentials.AccessKeyId,
            // secretAccessKey: credentials.SecretAccessKey,
            // sessionToken: credentials.SessionToken,
        }).getMetricData(params, function (err, data) {

            if (err) {
                resolve(err)
            }
            else {
                resolve(data)
                console.log(data)
            }
        })
    });
};
function format(data) {
    var tmp = []
    for (let i = 0; i < data.MetricDataResults.length; i++) { // Project's loop

        for (let j = 0; j < data.MetricDataResults[i].Timestamps.length; j++) { // Account's loop
            let str = data.MetricDataResults[i].Timestamps[j]
            let date = moment(str);
            tmp.push({
                Timestamp: date.format('DD-MM-YYYY'),
                Value: data.MetricDataResults[i].Values[j],
            })
        }

    }
    return (tmp)
}