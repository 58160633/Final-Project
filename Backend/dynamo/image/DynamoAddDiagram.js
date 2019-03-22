var AWS = require('aws-sdk');
AWS.config.update({ region: 'ap-southeast-1' });
module.exports.AddImg = (event, context, callback) => {
    // var Name = event.body.P_NAME
    console.log('Event :',event);
    
    var docClient = new AWS.DynamoDB.DocumentClient();
    var box = { ID: event.body.id }

    var params = {
        TableName: 'PROJECTF',
        Key: { "P_ID": box.ID }
    };
    // var tmp=[];
    docClient.get(params, function (err, data) {
        if (err) {
            console.log("Error :", err);
            //   callback(null, { status: 400, err });

        } else {
            var tempdata = data.Item.DIAGRAM

            tempdata.push({ 
                D_DATE : event.body.D_DATE,
                D_NAME : event.body.D_NAME,
                USER: event.body.user,
                LINK: event.body.LINK,
                Version: data.Item.DIAGRAM.length+1
            })

            var temp = [];
            // console.log("Data :", data)
            
            docClient.update({
                TableName: "PROJECTF",
                Key: { P_ID: box.ID },
                ExpressionAttributeValues: {
                    ":D": tempdata
                },
                UpdateExpression:
                    `set DIAGRAM= :D`
            }, (err, data) => {
                if (err) {
                    // console.log('Update', err.message)
                    callback(null, { status: 400, err });

                }
                else {
                    // console.log('Success', data);
                    callback(null, { status: 200, data });
                }
            })
        }
    });

}