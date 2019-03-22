var AWS = require('aws-sdk')
var requestSTS = require('../../requestSTS').requestSTS;

module.exports.ListELB = async (event, context, callback) => {
    // const listec2 = async (event) => {
    console.log("Event: ", event)
    var temp = {
        accessKeyId: event.body.accessKeyId,
        secretAccessKey: event.body.secretAccessKey,
        sessionToken: event.body.sessionToken,
        accountID: event.body.accountID
    }
    console.log("temp : ", temp)


    var res = await requestSTS(temp)

    console.log('res =', res.message.Credentials)


    var data = await promisePlease(res.message.Credentials);
    var tmp = [];
    for (let i = 0; i < data.TargetGroups.length; i++) { // Project's loop
        for (let j = 0; j < data.TargetGroups[i].LoadBalancerArns.length; j++) {
            tmp.push({
                LoadBalancer: (data.TargetGroups[i].LoadBalancerArns[j]).substring((data.TargetGroups[i].LoadBalancerArns[j]).indexOf('app'), (data.TargetGroups[i].LoadBalancerArns[j]).length),
                TargetGroup: (data.TargetGroups[i].TargetGroupArn).substring((data.TargetGroups[i].TargetGroupArn).indexOf('targetgroup'), (data.TargetGroups[i].TargetGroupArn).length),
                LoadBalancerArn: data.TargetGroups[i].LoadBalancerArns[j],
                TargetGroupArn: data.TargetGroups[i].TargetGroupArn,


            })
        }
    }

    callback(null, tmp)

}

var promisePlease = async (credentials) => {
    return new Promise(resolve => {

        var params = {};
        new AWS.ELBv2({
            region: 'ap-southeast-1',
            accessKeyId: credentials.AccessKeyId,
            secretAccessKey: credentials.SecretAccessKey,
            sessionToken: credentials.SessionToken
            ,
        }).describeTargetGroups(params, function (err, data) {

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

