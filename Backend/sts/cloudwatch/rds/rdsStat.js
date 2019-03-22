var AWS = require('aws-sdk')
var moment = require('moment')
var requestSTS = require('../../requestSTS').requestSTS;
module.exports.RDSStat = async (event, context, callback) => {
    console.log('event: ', event)
    var temp = {
        accessKeyId: event.body.accessKeyId,
        secretAccessKey: event.body.secretAccessKey,
        sessionToken: event.body.sessionToken,
        accountID: event.body.accountID,
    }
    var RDSId = event.body.InstanceIdentifier
    var Static = 'Average'
    var TimeEnd = event.body.TimeEnd
    var TimeStart = event.body.TimeStart
    var Period = 86400

    var res = await requestSTS(temp)
    console.log("New keys :", res.message.Credentials);

    var data1 = await CPU(res.message.Credentials, RDSId, Static, TimeEnd, TimeStart, Period);
    console.log("data1", data1);
    var CPUUtilization = format(data1);
    var data2 = await DBConections(res.message.Credentials, RDSId, Static, TimeEnd, TimeStart, Period);
    console.log("data2", data2);
    var conections = format(data2);
    var data3 = await ReadIOP(res.message.Credentials, RDSId, Static, TimeEnd, TimeStart, Period);
    console.log("data3", data3);
    var readIop = format(data3);
    var data4 = await WriteIOP(res.message.Credentials, RDSId, Static, TimeEnd, TimeStart, Period);
    console.log("data4", data4);
    var writeIop = format(data4);
    var data5 = await ReadLatency(res.message.Credentials, RDSId, Static, TimeEnd, TimeStart, Period);
    console.log("data5", data5);
    var readLatency = format(data5);
    var data6 = await WriteLatency(res.message.Credentials, RDSId, Static, TimeEnd, TimeStart, Period);
    console.log("data6", data6);
    var writeLatency = format(data6);

    var tmp = [{ TimeStart, TimeEnd, CPUUtilization, conections, readIop, writeIop, readLatency, writeLatency }]

    callback(null, tmp)
}
var CPU = async (credentials, RDSId, S, ET, ST, Period) => {
    return new Promise(resolve => {

        var params = {
            EndTime: ET,
            MetricDataQueries: [ /* required */
                {
                    Id: 'rdsCPU001',

                    MetricStat: {
                        Metric: {
                            Dimensions: [
                                {
                                    Name: 'DBInstanceIdentifier', /* required */
                                    Value: RDSId /* required */
                                },

                            ],
                            MetricName: 'CPUUtilization',
                            Namespace: 'AWS/RDS'
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
            region: 'ap-southeast-1',
            accessKeyId: credentials.AccessKeyId,
            secretAccessKey: credentials.SecretAccessKey,
            sessionToken: credentials.SessionToken
            ,
        }).getMetricData(params, function (err, data) {

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
var DBConections = async (credentials, RDSId, S, ET, ST, Period) => {
    return new Promise(resolve => {
        var params = {
            EndTime: ET,
            MetricDataQueries: [ /* required */
                {
                    Id: 'rdsDBConection001',
                    MetricStat: {
                        Metric: {
                            Dimensions: [
                                {
                                    Name: 'DBInstanceIdentifier', /* required */
                                    Value: RDSId /* required */
                                },

                            ],
                            MetricName: 'DatabaseConnections',
                            Namespace: 'AWS/RDS'
                        },
                        Period: Period, /* required */
                        Stat: S, /* required */
                        // Unit: Seconds | Microseconds | Milliseconds | Bytes | Kilobytes | Megabytes | Gigabytes | Terabytes | Bits | Kilobits | Megabits | Gigabits | Terabits | Percent | Count | Bytes / Second | Kilobytes / Second | Megabytes / Second | Gigabytes / Second | Terabytes / Second | Bits / Second | Kilobits / Second | Megabits / Second | Gigabits / Second | Terabits / Second | Count / Second | None
                    },
                    ReturnData: true
                },

                /* more items */
            ],
            StartTime: ST,

        };
        new AWS.CloudWatch({
            region: 'ap-southeast-1',
            accessKeyId: credentials.AccessKeyId,
            secretAccessKey: credentials.SecretAccessKey,
            sessionToken: credentials.SessionToken
            ,
        }).getMetricData(params, function (err, data) {

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
var ReadIOP = async (credentials, RDSId, S, ET, ST, Period) => {
    return new Promise(resolve => {

        var params = {
            EndTime: ET,
            MetricDataQueries: [ /* required */
                {
                    Id: 'rdsDBReadIOP001',
                    MetricStat: {
                        Metric: {
                            Dimensions: [
                                {
                                    Name: 'DBInstanceIdentifier', /* required */
                                    Value: RDSId /* required */
                                },

                            ],
                            MetricName: 'ReadIOPS',
                            Namespace: 'AWS/RDS'
                        },
                        Period: Period, /* required */
                        Stat: S, /* required */
                    },
                    ReturnData: true
                },

                /* more items */
            ],
            StartTime: ST,

        };
        new AWS.CloudWatch({
            region: 'ap-southeast-1',
            accessKeyId: credentials.AccessKeyId,
            secretAccessKey: credentials.SecretAccessKey,
            sessionToken: credentials.SessionToken
            ,
        }).getMetricData(params, function (err, data) {

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
var WriteIOP = async (credentials, RDSId, S, ET, ST, Period) => {
    return new Promise(resolve => {

        var params = {
            EndTime: ET,
            MetricDataQueries: [ /* required */
                {
                    Id: 'rdsDBWriteIOP001',
                    MetricStat: {
                        Metric: {
                            Dimensions: [
                                {
                                    Name: 'DBInstanceIdentifier', /* required */
                                    Value: RDSId /* required */
                                },

                            ],
                            MetricName: 'WriteIOPS',
                            Namespace: 'AWS/RDS'
                        },
                        Period: Period, /* required */
                        Stat: S, /* required */
                    },
                    ReturnData: true
                },

                /* more items */
            ],
            StartTime: ST,

        };
        new AWS.CloudWatch({
            region: 'ap-southeast-1',
            accessKeyId: credentials.AccessKeyId,
            secretAccessKey: credentials.SecretAccessKey,
            sessionToken: credentials.SessionToken
            ,
        }).getMetricData(params, function (err, data) {

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
var ReadLatency = async (credentials, RDSId, S, ET, ST, Period) => {
    return new Promise(resolve => {

        var params = {
            EndTime: ET,
            MetricDataQueries: [ /* required */
                {
                    Id: 'rdsDBReadLatency001',
                    MetricStat: {
                        Metric: {
                            Dimensions: [
                                {
                                    Name: 'DBInstanceIdentifier', /* required */
                                    Value: RDSId /* required */
                                },

                            ],
                            MetricName: 'ReadLatency',
                            Namespace: 'AWS/RDS'
                        },
                        Period: Period, /* required */
                        Stat: S, /* required */
                    },
                    ReturnData: true
                },

                /* more items */
            ],
            StartTime: ST,

        };
        new AWS.CloudWatch({
            region: 'ap-southeast-1',
            accessKeyId: credentials.AccessKeyId,
            secretAccessKey: credentials.SecretAccessKey,
            sessionToken: credentials.SessionToken
            ,
        }).getMetricData(params, function (err, data) {

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
var WriteLatency = async (credentials, RDSId, S, ET, ST, Period) => {
    return new Promise(resolve => {

        var params = {
            EndTime: ET,
            MetricDataQueries: [ /* required */
                {
                    Id: 'rdsDBWriteLatency001',
                    MetricStat: {
                        Metric: {
                            Dimensions: [
                                {
                                    Name: 'DBInstanceIdentifier', /* required */
                                    Value: RDSId /* required */
                                },

                            ],
                            MetricName: 'WriteLatency',
                            Namespace: 'AWS/RDS'
                        },
                        Period: Period, /* required */
                        Stat: S, /* required */
                    },
                    ReturnData: true
                },

                /* more items */
            ],
            StartTime: ST,

        };
        new AWS.CloudWatch({
            region: 'ap-southeast-1',
            accessKeyId: credentials.AccessKeyId,
            secretAccessKey: credentials.SecretAccessKey,
            sessionToken: credentials.SessionToken
            ,
        }).getMetricData(params, function (err, data) {

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
function format2(data) {
    var tmp = []
    for (let i = 0; i < data.MetricDataResults.length; i++) { // Project's loop

        for (let j = 0; j < data.MetricDataResults[i].Timestamps.length; j++) { // Account's loop
            let str = data.MetricDataResults[i].Timestamps[j]
            let date = moment(str);
            tmp.push({
                Timestamp: date.format('DD-MM-YYYY'),
                Value: data.MetricDataResults[i].Values[j]*100,
            })
        }

    }
    return (tmp)
}