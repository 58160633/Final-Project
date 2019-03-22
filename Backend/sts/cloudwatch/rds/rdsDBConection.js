var AWS = require('aws-sdk')
var requestSTS = require('../../requestSTS').requestSTS;
module.exports.RDSDBcons = async (event, context, callback) => {
    console.log('event: ', event)
    var temp = {
        accessKeyId: event.body.accessKeyId,
        secretAccessKey: event.body.secretAccessKey,
        sessionToken: event.body.sessionToken,
        accountID: event.body.accountID,
    }
    var RDSId = event.body.InstanceIdentifier
    var res = await requestSTS(temp)
    var data = await promisePlease(res.Credentials, RDSId);
    var tmp = []
    for (let i = 0; i < data.MetricDataResults.length; i++) { // Project's loop

        for (let j = 0; j < data.MetricDataResults[i].Values.length; j++) { // Account's loop

            tmp.push({
                Timestamp: data.MetricDataResults[i].Timestamps[j],
                Value: data.MetricDataResults[i].Values[j],
            })
        }

    }

    callback(null, tmp)

}
var promisePlease = async (credentials, RDSId) => {
    return new Promise(resolve => {

        var params = {
            EndTime: '2019-01-30T23:59:59.000Z',
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
                        Period: 300, /* required */
                        Stat: 'Average', /* required */
                        // Unit: Seconds | Microseconds | Milliseconds | Bytes | Kilobytes | Megabytes | Gigabytes | Terabytes | Bits | Kilobits | Megabits | Gigabits | Terabits | Percent | Count | Bytes / Second | Kilobytes / Second | Megabytes / Second | Gigabytes / Second | Terabytes / Second | Bits / Second | Kilobits / Second | Megabits / Second | Gigabits / Second | Terabits / Second | Count / Second | None
                    },
                    ReturnData: true
                },

                /* more items */
            ],
            StartTime: '2019-01-01T00:00:00.000Z',

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
