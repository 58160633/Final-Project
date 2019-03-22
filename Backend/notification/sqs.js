var AWS = require('aws-sdk');

AWS.config.update({region:'ap-southeast-1'});
var sqs = new AWS.SQS({apiVersion: '2012-11-05'});

var params = {
    QueueName: 'QueueNameProject',
    Attributes: {
        'QueueAttributeName': 'QueueNameProject',
    }
};

sqs.createQueue(params, function(err,data) {
    if (err) console.log(err, err.stack);
    else     console.log(data);
});