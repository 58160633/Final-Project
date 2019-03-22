var AWS = require('aws-sdk')
var sts = new AWS.STS();
var requestSTS = require('../../requestSTS').requestSTS;
async function listec2(event) {
    // const listec2 = async (event) => {
    var credentials = await requestSTS(event); //ขอกุญแจ
    console.log("credentials", JSON.stringify(credentials));

    const describeInstances = async (credentials) => {
        try {
            return new Promise((resolve) => {
                var params = {};
                new AWS.EC2({
                    region: 'ap-southeast-1',
                    accessKeyId: credentials.AccessKeyId,            //รอจากหน้าบ้านส่งมาให้
                    secretAccessKey: credentials.SecretAccessKey,    //รอจากหน้าบ้านส่งมาให้
                    sessionToken: credentials.SessionToken           //รอจากหน้าบ้านส่งมาให้
                }).describeInstances(params, function (err, data) {
                    if (err) {
                        resolve(err)
                    }
                    else {
                        var describeEC2 = [];
                        console.log(data.Reservations[0]);
                        for(let i = 0; i < data.Reservations.length; i++){
                            describeEC2[i] = {
                                statusCode: 200,
                                InstanceId : data.Reservations[i].Instances[0].InstanceId,
                                InstanceType : data.Reservations[i].Instances[0].InstanceType,
                                PrivateIp :data.Reservations[i].Instances[0].PrivateIpAddress,
                                PublicIp : data.Reservations[i].Instances[0].PublicIpAddress,
                                StateCode : data.Reservations[i].Instances[0].State.Code,
                                Status : data.Reservations[i].Instances[0].State.Name,
                                KeyName : data.Reservations[i].Instances[0].KeyName,
                                CPU : data.Reservations[i].Instances[0].CpuOptions
                            }
                        }
                        resolve(describeEC2)
                    }
                });
            })
        } catch (err) {
            console.log('catch')
            console.log(err.stack);
            return { statusCode: 400, message: 'no KEY'};
        }
    }

    return await describeInstances(credentials.message.Credentials)

}

module.exports = { listec2 }