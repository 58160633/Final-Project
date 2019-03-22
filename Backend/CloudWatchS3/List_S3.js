var AWS = require ('aws-sdk');

var sts = new AWS.STS({
    accessKeyId: "ASIAWQEZB5232S6U7P7J",
    sessionToken: "AgoGb3JpZ2luEIP//////////wEaDmFwLXNvdXRoZWFzdC0xIoACeUKs51cu324TP5iS3YEohAizzas355mw4xr4YN8tI6CHu/g+oYfafHduZRh4cGaWFrJzh0dzhlGf4/XlH1AahrY/m143rMJoIRIl9083HJcDuld7Q0kp+k+06/xUuImv+ZhBaV2Wu8+HvyVtw2bGxor3NRDtiEBuj0YvaP0R6H5zV4g9eiZgPuiQSlfRLvS2lPj2TflO7SCWzs7fU9jGfWrfZ+0ipguSvHh6Jn4gfeN8+5TONQ9zahPWAQLyR/hS7KylTFA6yP0fmj/bGa0nKCQkC+puB5fXdR4U6WQfkZMkh4zBLkp+b5jdqS9Moua8+ehRq0wn2hE8GnvQJUqzLSrNBQi4//////////8BEAAaDDQ0Njk5NzU4OTY4NyIMxz3xMPnihb2aSnetKqEFmQ9i/jDGWabs5K2HCQ3Jedtymm6mpo7hvjZEiaPDRkKr8y4Mhk/fbxDXjCe5eCrgjgDEIk/tduzZCO32F/JsUR63xmwTQk/ZKH9vLu7jfEaZ7tR1ZIt9hbtQ0W93pCi6oKtiqLqMYCQTQoKEfsI7CrcRA64amVRUMOYdNG5a0fIgq7wcQDM6NtLcw7/IBzxWhIrvfYalZnxrmY/H8f2kCNiY0mdKly19k6KG8pmEvbur1wpyDvBJEZtVM/Z+Z3alaL+hjiObLjLjRdTsR2rgcqzlAVs4DBDYSgqLYo6B4acRfeS4h7I2P08zoywHmBAJhq9U2zYRTBnZ5jZ4u4nEmM9u2jC7RSu9DhZuoRiLW20ntceamaicT7Aqr7ClefEx3A2ORXPbNes2nevB4RaR7G25rgF8dAup/iwz9jYZRc9p5pRG9LUnXXr4kZHezOOHGU7VEi0hPLpqpG0qjh283KW+w3FoCOFlQRstVvTzTuHZx6vMOYGTddBsCnAGggW7PJjC3Edhq52A3sLmXMFkIora4RQahoBNpAc0tX+nHgTl4BCceFXu1nA+tnEjJE/Nblc4k235KkJileU1Boj9ooMFgpf6yMMVjl9kPz5GSVDsGLzlILzETD3gs/S8C3wugOuqNGczV+3w8Nz91oZEc9h9phEuHBxz1oUMIUXFHmWT1JYWgT8NifC9PlAXCT3l3QyCpI/XVb3tqYMhx4+dgvyoHqFkPttpQ3ij5wDvgHaYqtadbiHZBPSGTuJaQtlISoKnJ4GrBrx8wnRHQrWoS382cHnIcTj9FYvYpIHFZBeOHAyo7cSwjCoQKdcD57xfUjOxdeF98i87A+RHuSngXenTXDL6QNcSDoqhob1DVNyaU1ArQ3GS6dRWrr9NO1fwbDDMl/PjBQ==",
    secretAccessKey: "jXNSeQSv5ge6Dzz2EO0m/alsN2znHiCfXRKNzpQY"
});

var accountID = '427303592433'

sts.assumeRole({
    RoleArn : `arn:aws:iam::${accountID}:role/SentinelCognito-ReadOnly`,
    RoleSessionName : 'awssts'
},

async function (err, data) {
    if (err) {
        console.log ('Cannot assume role');
        console.log (err, err.stack);
    } else {
        console.log (data);


        var s3 = new AWS.S3({
            region: 'ap-southeast-1',
            accessKeyId : data.Credentials.AccessKeyId,
            secretAccessKey : data.Credentials.SecretAccessKey,
            sessionToken : data.Credentials.SessionToken
        })


        // var tmp = [];
        var params;

        return new Promise((resolve) => {
            s3.listBuckets(params, function (err, data) {
                if (err) console.log (err, err.stack);
                else 
                    // for (let i = 0; i < data.Reservations.length; i++) {
                    //     for (let j = 0; j < data.Reservations[i]; j++) {

                    //         tmp.push({InstanceId:data.Reservations[i].Instances[j].InstanceId,
                    //                     KeyName:data.Reservations[i].Instances[j].KeyName
                    //                 })

                    //     }
                    // }
                
                console.log (data);
            });

        })
        
    }
})

