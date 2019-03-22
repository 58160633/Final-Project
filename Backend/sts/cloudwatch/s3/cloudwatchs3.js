var AWS = require('aws-sdk');
AWS.config.update({ region: 'ap-southeast-1' });
var requestSTS = require('../../requestSTS').requestSTS
var ListS3 = require('../s3/ListS3').listBuckets
var moment = require('moment');


async function getMetricData(event) {

    
    const key = await requestSTS(event);
    if (key.statusCode == 400) {
        return key
    }
    var BucketName = await ListS3(event)

// console.log("BucketName",BucketName);

    var ListS3name = BucketName


    // BucketSizeBytes

    var templateMetricStat = [];
    for (let i = 0; i < ListS3name.length; i++) {
        let template = {
            Id: `${("BucketSizeBytes").toLowerCase() + "_" + i}`,
            MetricStat: {
                Metric: {
                    Dimensions: [
                        {
                            Name: 'BucketName',             //Label
                            Value: ListS3name[i].BucketName
                        },
                        {
                            Name: 'StorageType',
                            Value: 'StandardStorage'        //Values
                        }
                    ],
                    MetricName: 'BucketSizeBytes',
                    Namespace: 'AWS/S3'
                },
                Period: 86400,
                //Period: 25920000,
                Stat: 'Average'
            },
            ReturnData: true
        }
        templateMetricStat.push(template)
    }



    // NumberOfObject
    // var templateMetricStat2 = [];
    // for (let i = 0; i < ListS3name.length; i++) {
    //     let template = {
    //         Id: `${("NumberOfObjects").toLowerCase() + "_" + i}`,
    //         MetricStat: {
    //             Metric: {
    //                 Dimensions: [
    //                     {
    //                         Name: 'BucketName',             //Label
    //                         Value: ListS3name[i].BucketName
    //                     },
    //                     {
    //                         Name: 'StorageType',
    //                         Value: 'AllStorageTypes'        //Values
    //                     }
    //                 ],
    //                 MetricName: 'NumberOfObjects',
    //                 Namespace: 'AWS/S3'
    //             },
    //             Period: 86400,
    //             //Period: 25920000,
    //             Stat: 'Average'
    //         },
    //         ReturnData: true
    //     }
    //     templateMetricStat.push(template)
    // }





    // console.log("templateMetricStat", templateMetricStat);

    
    var params = {
        EndTime: event.timeEnd, /* required */
        MetricDataQueries: templateMetricStat,
        StartTime:  event.timeStart, /* required */       //Timestamp
    };   
    // console.log(params);
    
    const promise =async (key) => {
        return new Promise(
            (resolve) => {
                new AWS.CloudWatch({
                    accessKeyId: key.AccessKeyId,               //รับกุญแจคีย์บ้านที่สองมา
                    sessionToken: key.SessionToken,
                    secretAccessKey: key.SecretAccessKey,
                    

                }).getMetricData(params, function (err, data) {
                    if (err) {
                        //console.log('err : ', err.stack);
                        console.log('err getMetricData')
                        // console.log(err, err.stack); // an error occurred
                        resolve(err)
                    } else {
                        // console.log(data);
                      resolve(format(data))
                        // resolve(format(data))
                    }
                });
            }
        )
    }
    let data = await promise(key.message.Credentials)


    
    // data มี template ที่เราสร้างมา
    //format ให้หาร /1000000
// async function format(data) {

   
async function format(data) {

    // console.log(data.MetricDataResults.length);
    
    var arrS3 = [];
    for (let i = 0; i < data.MetricDataResults.length; i++) {
    
        for (let j = 0; j < data.MetricDataResults[i].Timestamps.length; j++) {

            let str = data.MetricDataResults[i].Timestamps[j]
            let date= moment(str);
            let templateinloop = {
                BucketID: data.MetricDataResults[i].Id,
                BucketName :  data.MetricDataResults[i].Label ,
                Timestamp: date.format('DD-MM-YYYY'),
                //Timestamp: data.MetricDataResults[i].Timestamps[j],
                Value: data.MetricDataResults[i].Values[j]/1000000
            }
            arrS3.push(templateinloop);
        }
    }
    return arrS3
}

return data
}

module.exports = { getMetricData }

// let config = {
//     accessKeyId: "ASIAWQEZB523YLBX7A62",
//     secretAccessKey: "5VlrayOt2XpPArAi30LhPTPSxP2MRejdakx2ggKd",
//     sessionToken: "AgoGb3JpZ2luEHAaDmFwLXNvdXRoZWFzdC0xIoACh2RX7/omcod+0LpZwf0CWnyFYVbHo67hhmV2yugzT+WgF+mv3bg4SQI0UOIdpOh+WCieQbv/Zd5NqXxtLOjpDys+XMOVYFgiNv/LpZZbrpjb0+LImhPnffa9ixP+Z9hdBw8ciZlRt+jn1jIpExi5VtPFUmRgtkecTm7KMWbVGeiKTsO9lEoYy3GjUOLUzfKszK2riub/t3RU/Lt8lBXVM3pjgXJYtf0rT3/HzT5UWzLuGvuvPFDr1sFIIBizvSampeAOapKU4dd3cRPvMr4y5nBZ8So91ZfgMClMSU+JeVk5WJrRWj3mzT9iVMQS6f1LxbnUXvV1AWkiV8Jcg2EzVCrNBQi1//////////8BEAAaDDQ0Njk5NzU4OTY4NyIMC9piBJ6Im6oCXNt3KqEFmmffId0S1v5nGCpHrWRtfmBGXDxQUmkL6Rd/vtehWCVs1E+6zsUUA66eJ9RfoeS7uovYSl3EZXQIKoN2rB+5XNGT1X0BOfmjWKBHQt+4Jznp0221Z73ACiW7MBzJHwE6GtV2TkFiUdg+4c17j1eew+qwb5s4l9vGkb7SpzwSUP9SavN6s6MIbvgEG7M+invbo+elV7hZDQ2LyY7Scif4ncpMAcy8siQv/DZs0EReP1hoBpL+4zc/fYnNVQ2FJsjm3FwQGACxA8jAMWXaag8t7CA+/6gTH+DLtl3DpSp9rPmTJJca9Yo68neWoodf9OknZZdMRjhpXAvZpOa6FpV+rC9MnY475LfZYYzuj1tajjUQ/hnjpg66fEZvX3TBhN9R5lYUKw/YWKwe5C7WPCt7XXi3UiN4snqDi3Fg4ps0YJHpAiopLyroTZ31rc0rjcM7qFEZEHIdCkZZqdXObVFVhBWDQT5lZWtSNRey9Su+POoOKyxikkOlEVmEoK/eUY8d1AV2/TaAK3BrtBpogITZ6bzUa1u2fAQcTusnDNPkt6V2Bqxdr/Dzh+HRTthdjwBrHxkpq0eGXAOsRYCOrqbJJv7PnqwPBFMNAIWuXhsVPTdQpjSvgMo/uL+LNCvZvvyeiDneMGrBqdl1jaqBXBrEvYE4dHgRMxHOLshWjJIDdV//+L7M4TGdeLOgOrYngYyWVkwHgRXqMb1lw1krG4bQrEGEosRBAqTXUbstpbaLq1AiezxkxSiVvv3+KGti6Dj5rvmSouW/EbCHQnwpBIyf0EcioaeU/CNwnzQmvSzwuduONEbE68zQKdtML8EVa2dv6D6K6ZeYsc1WrX1ehAoyYCqCPyS4td4sxT/ftGD1RzGLqDPRosqonPTUZjFwsacYBTDepafkBQ=="
//     , accountID: '427303592433'
// }

// log()
// async function log() {

//      console.log(await getMetricData(config));
    
//     // await getMetricData(config)

// }


// function format(data) {
//     var tmp = [];
//     for (let i = 0; i < data.getMetricData.length ; i++) {
//         for (let j = 0; j < data.getMetricData.length[i].Timestamp.length ; j++) {
//             let str = data.getMetricData[i].Timestamp[j]
//             let date = moment(str);
//             tmp.push({
//                 Timestamp: date.format('DD-MM-YYYY'),
//                 Value: data.MetricDataResults[i].Values[j]/1000000
//             })
//         }
//     }
//     return tmp
// }

