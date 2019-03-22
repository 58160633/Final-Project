var AWS = require('aws-sdk');
AWS.config.region = 'ap-southeast-1';
var sts = new AWS.STS();


exports.getcredential = async (event) => {
    sts = new AWS.STS({                            
        accessKeyId: event.body.accessKeyId,          
        secretAccessKey: event.body.secretAccessKey,    
        sessionToken: event.body.sessionToken     
    });

    var accountID = event.body.accountID
    
    sts.assumeRole({
        RoleArn: `arn:aws:iam::${accountID}:role/SentinelCognito-ReadOnly`,
        RoleSessionName: 'awssts'   
    }, 
        function(err, data) {
        if (err) {      // an error occurred
            console.log('Cannot asuume role');
            console.log(err, err.stack);
        } else { // successful response
            console.log(data)
            AWS.config.update({             
              accessKeyId: data.Credentialseve.AccessKeyId,            
              secretAccessKey: data.Credentialseve.SecretAccessKey,    
              sessionToken: data.Credentialseve.SessionToken           
            });
            
        }
    });
    return 'OK'
};


