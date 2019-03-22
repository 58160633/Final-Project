var AWS = require('aws-sdk');
AWS.config.update({ region: 'ap-southeast-1' });
var requestSTS = require('../sts/requestSTS').requestSTS

let config = {
  accessKeyId: "ASIAWQEZB52323JQDWVS",
  secretAccessKey: "THdm/LTEXV3wAth/9NMbrxVa756vXGChEz6oemtl",
  sessionToken: "AgoGb3JpZ2luEIT//////////wEaDmFwLXNvdXRoZWFzdC0xIoACEx1I1ozFAdN2IMGPB+43KzGf6Pe946rdKPgq9AOoJAUh+IRzOXrcfPJSUszw/+qOwASdInrHcVixZ5RTZBwYS5pnuism7JObHddAlkOWQ7J9++gVjPcyHfn/ovtT8e9Ar7tSVPHCHqzyJLrg+HIGVjf7eUkvfu0y1JS+NAYSnqQGkD5vUm3jqRmZ4yE3OEb0+X95KzcR0rMMVz7k3hWnDUec8eQW24UoHu4duLJoDTZAOzaKPrKqSsKcb0mo0Lm1r0OtD9AXqtcDDhxtUgeMzSAPQ6NA4pMO43yJKhWmQwqCHrYlLHdz2uH6ek5cf/7cMkQm+mk5ViSGPrguCyH6QirNBQi5//////////8BEAAaDDQ0Njk5NzU4OTY4NyIMaorKQtU6ukJZ80V8KqEFF1y5mYu6YRbQqV6HuSk+g/jDFlZSjNvLUUCf0QjhJvdwxss+i5Kge+W4G0nuod8lgeFeXYkHE9lvUkl6NqCq+dKsDGVFNq8KAX80apaazxWLKwdJy3n2ABuhNeQoj89/KCVgOkE2/KPL6FGIzS6hLpdB+CsQp374uwWOS8vRpMVpzFzkl8CVSrEOy156uu7/eN2xRlc40kzQQWNVY53+/BBq9q7LYbnOSc8jxtRfTh3MZda1g7bQZQJdkbhnyKJo+wAUEHSzkOGci0bH349t16+c7ONNVDxT9nvV9hnKUUgmGs6XGlSz1gc5LPj9dG1CTAGWVX5aj4InYUqiIo3XuWGmn1Qm7cShrzHEFTDYgqy53xPhieZTuACrnL2RR7eyrycmAFt1da1162/oQdXXvkqfAqsZ9kcLzB5Bu/U+kVI6hfIfPdJnZDqAsAZI4hGFgRVKndiexwQ8YqSAGydTQagkQ7f2WfO28n6HZX8IdvBciV3wPWAmGE6u4zPE2IvCrttjgtjZwxNgIUfZ2SHwz787OHOC+MWuAuVvXYtYxiGF9fie7q9pWSWETYowwzbwVs7tWBQwIXiwVM/xOk1b/zq4aEVvehaQyEX0QaElnGw+cfWTKUFysS/wBz5vLTKR54ILk7gqRo5woXupESsrTo3qzdchFsxklc8si42GgBlyoRNLMxcPCsgpYLQl03+vp16c/zP1+fGWzBEuD3acqF9qzUXh1H3XoubuXuMmGyboIJyHdz6Kv/hA89T1Nr3jvi+WmDGGiaHL8a3yzhyY+JEH+OAJ4m5br5S3Hoi68pQ/8hJSPQ0CHxbFOsIgdwsHUbEpTxf9QoOeMjM8KzXAg78HmOOjkST28URdYurDzkBrBpiy2Q3/idg6KlKNmSjcwDDatvPjBQ=="


}

//module.exports.Bucketlog = async (event, context, callback) => {

async function getMetricStatistics() {

  const key = await requestSTS(config);
  var cloudwatch = new AWS.CloudWatch({
    accessKeyId: key.AccessKeyId,
    sessionToken: key.SessionToken,
    secretAccessKey: key.SecretAccessKey
  });

  var params = {
    // EndTime: 'Friday Mar 1 2019 10:37:55 GMT-0800 (UTC)', /* required */
    EndTime: '2019-03-01T10:37:55.000Z',
    MetricName: 'BucketSize', /* required */
    Namespace: 'AWS/S3', /* required */
    Period: 300, /* required */
    // StartTime: 'Thu Feb 21 2019 16:00:00 GMT-0800 (UTC)', /* required */
    StartTime :  '2019-02-21T16:00:00.000Z',
    Dimensions: [
      {
        Name: 'BucketName', /* required */
        Value: 'prd-uniappmfu' /* required */
      },
      /* more items */
    ],
    // ExtendedStatistics: [
    //   'STRING_VALUE',
    //   /* more items */
    // ],
    Statistics: [
      'SampleCount', 'Maximum',
      /* more items */
    ],
    //Unit: 'Gigabytes'
  };
  cloudwatch.getMetricStatistics(params, function (err, data) {
    if (err) {
    console.log(err, err.stack); // an error occurred
    //callback (null, err);
    
    
    } else { console.log(data);           // successful response
    // callback (null, {
    //   statusCode : 200,
    //   statusDescription : "CloudWatch AWS S3 Successfully"
    // })
    }
  });
}


getMetricStatistics() 

//}