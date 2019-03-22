var AWS = require('aws-sdk')
//AWS.config.update = ({ region: 'ap-southeast-1' })
var requestSTS = require('../../requestSTS').requestSTS


async function listBuckets(event) {
    

    var credentials = await requestSTS(event);

    const promisePlease = async (credentials) => {
        return new Promise(resolve => {
            var params = {};
            new AWS.S3({
                region: 'ap-southeast-1',
                accessKeyId: credentials.AccessKeyId,            //รอจากหน้าบ้านส่งมาให้
                secretAccessKey: credentials.SecretAccessKey,    //รอจากหน้าบ้านส่งมาให้
                sessionToken: credentials.SessionToken           //รอจากหน้าบ้านส่งมาให้
            }).listBuckets(params, function (err, data) {
                if (err) {

                    //console.log(err, err.stack); // an error occurred
                    resolve(err)
                }
                // callback (null, err);
                else {
                    
                    resolve(data)
                }

            });
        });
    };

    var data = await promisePlease(credentials.message.Credentials);

    var tmp = [];
    for (let i=0; i < data.Buckets.length ; i++) {
        tmp.push({
            BucketName: data.Buckets[i].Name,
            CreationDate: data.Buckets[i].CreationDate,
        })
         
    }
    return tmp;

    //return data
}

//listBuckets();
module.exports = { listBuckets }

//}








