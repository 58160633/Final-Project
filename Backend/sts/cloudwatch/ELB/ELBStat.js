var AWS = require('aws-sdk')
var moment = require('moment')
var requestSTS = require('../../requestSTS').requestSTS;

module.exports.ELBStat = async (event, context, callback) => {
    // console.log('event: ', event)
    var temp = {
        accessKeyId: event.body.accessKeyId,
        secretAccessKey: event.body.secretAccessKey,
        sessionToken: event.body.sessionToken,
        accountID: event.body.accountID,
    }
    // var LBA = 'app/PRD-uniappmfu-ALB-APP/937a607d89b26368'
    var LBA = event.body.LoadBalancer //LoadBalancer
    var TGA = event.body.TargetGroup
    var Static = 'Average'
    var TimeEnd = event.body.TimeEnd
    var TimeStart = event.body.TimeStart
    var Period = 86400

    var res = await requestSTS(temp)
    // console.log("New keys :", res.message.Credentials);
    // console.log("LBA : ", LBA);


    var data1 = await HealthyHostCount(res.message.Credentials, LBA, TGA, Static, TimeEnd, TimeStart, Period);
    console.log("data1", data1);
    var HHC = format(data1);
    var data2 = await RequestCount(res.message.Credentials, LBA, TGA, Static, TimeEnd, TimeStart, Period);
    console.log("data2", data2);
    var RC = format(data2);



    var tmp = [{ TimeStart, TimeEnd, HHC, RC, }]
    // console.log(data1);

    callback(null, tmp)
}


var HealthyHostCount = async (credentials, LBA, TGA, S, ET, ST, Period) => {
    return new Promise(resolve => {

        var params = {
            EndTime: ET,
            MetricDataQueries: [ /* required */
                {
                    Id: 'elbLATENCY001',

                    MetricStat: {
                        Metric: {
                            Dimensions: [
                                {
                                    Name: 'LoadBalancer', /* required */
                                    Value: LBA /* required */
                                },
                                {
                                    Name: 'TargetGroup',
                                    Value: TGA
                                }

                            ],
                            MetricName: 'HealthyHostCount',
                            Namespace: 'AWS/ApplicationELB'
                        },
                        Period: 86400, /* required */
                        Stat: S /* required */

                    },
                    ReturnData: true
                },

                /* more items */
            ],
            StartTime: ST,

        };


        // console.log(params);

        new AWS.CloudWatch({
            region: 'ap-southeast-1',
            accessKeyId: credentials.AccessKeyId,
            secretAccessKey: credentials.SecretAccessKey,
            sessionToken: credentials.SessionToken,
        }).getMetricData(params, function (err, data) {

            if (err) {
                resolve(err, credentials)
            }
            else {
                resolve(data)
                // console.log(data)
            }
        })
    });
};
var RequestCount = async (credentials, LBA, TGA, S, ET, ST, Period) => {
    return new Promise(resolve => {

        var params = {
            EndTime: ET,
            MetricDataQueries: [ /* required */
                {
                    Id: 'elbLATENCY001',

                    MetricStat: {
                        Metric: {
                            Dimensions: [
                                {
                                    Name: 'LoadBalancer', /* required */
                                    Value: LBA /* required */
                                },
                                {
                                    Name: 'TargetGroup',
                                    Value: TGA
                                }

                            ],
                            MetricName: 'RequestCount',
                            Namespace: 'AWS/ApplicationELB'
                        },
                        Period: 86400, /* required */
                        Stat: S /* required */

                    },
                    ReturnData: true
                },

                /* more items */
            ],
            StartTime: ST,

        };


        // console.log(params);

        new AWS.CloudWatch({
            region: 'ap-southeast-1',
            accessKeyId: credentials.AccessKeyId,
            secretAccessKey: credentials.SecretAccessKey,
            sessionToken: credentials.SessionToken,
        }).getMetricData(params, function (err, data) {

            if (err) {
                resolve(err, credentials)
            }
            else {
                resolve(data)
                // console.log(data)
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