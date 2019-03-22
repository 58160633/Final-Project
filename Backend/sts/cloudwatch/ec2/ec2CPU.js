var AWS = require("aws-sdk");
var requestSTS = require("../../requestSTS").requestSTS;
const moment = require('moment')

async function CPUStat(credentials) {
  console.log("event: ", credentials);
  var temp = {
    accessKeyId: credentials.accessKeyId,
    secretAccessKey: credentials.secretAccessKey,
    sessionToken: credentials.sessionToken,
    accountID: credentials.accountID
  };

  var res = await requestSTS(temp);
  var sts = {
    InstanceId: credentials.InstanceId,
    Static: "Average",
    EndTime: credentials.TimeEnd,
    StartTime: credentials.TimeStart,
    Period: 86400
  };

  var cpu = await getCPU(res.message.Credentials, sts);
  var networkIn = await getNetworkIn(res.message.Credentials, sts);
  var networkOut = await getNetworkOut(res.message.Credentials, sts);
  var tmp = [
    { 
      cpuUtilization: cpu, 
      networkIn: networkIn, 
      networkOut: networkOut
    }
  ];
  return tmp;

}
var ec2Cloudwatch = async (credentials, params) => {
  return new Promise(resolve => {
    new AWS.CloudWatch({
      region: "ap-southeast-1",
      accessKeyId: credentials.AccessKeyId,
      secretAccessKey: credentials.SecretAccessKey,
      sessionToken: credentials.SessionToken
    }).getMetricData(params, function(err, data) {
      if (err) {
        resolve(err, credentials);
      } else {
        resolve(data);
        // console.log(data);
      }
    });
  });
};

async function getCPU(credentials, sts) {
  var dynamicName = {
    Id: "ec2CPU001",
    MetricName: "CPUUtilization"
  };
  var params = getParams(dynamicName, sts);
  var CPU = await ec2Cloudwatch(credentials, params);
  return await format(CPU);
}

async function getNetworkIn(credentials, sts) {
  var dynamicName = {
    Id: "ec2NetworkIn001",
    MetricName: "NetworkIn"
  };
  var params = getParams(dynamicName, sts);
  var NetworkIn = await ec2Cloudwatch(credentials, params);
  return await format(NetworkIn);
}

async function getNetworkOut(credentials, sts) {
  var dynamicName = {
    Id: "ec2NetworkOut001",
    MetricName: "NetworkOut"
  };
  var params = getParams(dynamicName, sts);
  var NetworkOut = await ec2Cloudwatch(credentials, params);
  return await format(NetworkOut);
}

function getParams(dynamicName, sts) {
  return {
    EndTime: sts.EndTime,
    MetricDataQueries: [
      {
        Id: dynamicName.Id,
        MetricStat: {
          Metric: {
            Dimensions: [
              {
                Name: "InstanceId",
                Value: sts.InstanceId
              }
            ],
            MetricName: dynamicName.MetricName,
            Namespace: "AWS/EC2"
          },
          Period: sts.Period,
          Stat: sts.Static
        },
        ReturnData: true
      }
    ],
    StartTime: sts.StartTime
  };
}

async function format(data) {
  console.log(data)
  console.log('=======================================================')
  var tmp = [];
  data.MetricDataResults.forEach(item => {
    for(var i = 0; i < item.Values.length; i++) {
      var date = moment(item.Timestamps[i])
      tmp.push({
        Timestamp: date.format('DD-MM-YYYY'),
        Value: item.Values[i]
      });
    }
  });

  console.log(data.Label, JSON.stringify(tmp));
  return tmp;
}

module.exports = { CPUStat };