var AWS = require('aws-sdk');
AWS.config.update({ region: 'ap-southeast-1' });
module.exports.EditP = (event, context, callback) => {
    var docClient = new AWS.DynamoDB.DocumentClient();
    console.log(event);

    var box = {
        ID_CUS: event.body.project.ID_CUS,
        P_NAME: event.body.project.P_NAME,
        P_ID: event.body.project.P_ID,
        P_CODE: event.body.project.P_CODE,
        P_DateEnd: event.body.project.P_DateEnd,
        P_DateStart: event.body.project.P_DateStart,
        P_Sale: event.body.project.P_Sale,
        P_Stage: event.body.project.P_Stage,
    }
    console.log("Box :", box);

    var params = {
        TableName: 'CUSTOMERS',
        Key: { "ID_CUS": box.ID_CUS }
    };

    docClient.get(params, function (err, data) {
        if (err) {
            console.log("Error :", err);
            //   callback(null, { status: 400, err });
        } else {
            // var temp = [];
            console.log("Data :", data)
            // callback(null, { status: 200, data });
            var target_project = data.Item.PROJECTS.findIndex(key =>
                key.P_ID === box.P_ID

            );
            // console.log("Taget :", target_project);

            docClient.update({
                TableName: "CUSTOMERS",
                Key: { ID_CUS: box.ID_CUS },
                ExpressionAttributeValues: {
                    ":P_NAME": box.P_NAME,
                    ":P_Stage": box.P_Stage
                },
                UpdateExpression:
                    `set PROJECTS[${target_project}].P_NAME = :P_NAME, P_Stage = :P_Stage`
            }, (err, data) => {
                if (err) {
                    // console.log('Update', err.message)
                    callback(null, { status: 400, err });
                }
                else {
                    // console.log('Success', data);
                    var got = "Edited it"
                    callback(null, { status: 200, got });
                }
            })
        }
    });
    docClient.update({
        TableName: "PROJECTF",
        Key: { P_ID: box.P_ID },
        ExpressionAttributeValues: {
            ":P_NAME": box.P_NAME,
            ":P_CODE": box.P_CODE,
            ":P_Sale": box.P_Sale,
            ":P_Stage": box.P_Stage,
            ":P_DateStart": box.P_DateStart,
            ":P_DateEnd": box.P_DateEnd,
        },
        UpdateExpression:
            `set P_NAME = :P_NAME, P_CODE = :P_CODE, P_Sale = :P_Sale, P_Stage = :P_Stage, P_DateStart = :P_DateStart, P_DateEnd = :P_DateEnd`
    }, (err, data) => {
        if (err) {
            // console.log('Update', err.message)
            callback(null, { status: 400, err });
        }
        else {
            // console.log('Success', data);
            var PROJECT = "Edited it"
            callback(null, { status: 200, PROJECT });
        }
    })
}