var AWS = require('aws-sdk');

AWS.config.update({region: 'ap-southeast-1'});

var params = {
    Message: 'Hello!! Everybody',
    TopicArn: 'arn:aws:sns:ap-southeast-1:446997589687:Notification-Test'
};

var publishTextPromise = new AWS.SNS({apiVersion: '2010-03-31'}).publish(params).promise();

publishTextPromise.then(
    function(data) {
        console.log("Message ${params.Message} send to the topics ${params.TopicArn}");
        console.log("MessageID is " + data.MessageId);
    }).catch(
        function(err) {
            console.error(err.stack);
        });
