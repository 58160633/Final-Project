// EditXXXXXXXXXX
// 'use strict';
// var getcre = require('./Backend/sts/credentials')
var Joi = require('joi');
var listbucketcloudwatchs3 = require('./Backend/sts/cloudwatch/s3/cloudwatchs3').getMetricData
var bucket = require('./Backend/sts/cloudwatch/s3/ListS3').listBuckets
var descriptions = require('./Backend/sts/cloudwatch/ec2/description').listec2
var Ec2CPU = require('./Backend/sts/cloudwatch/ec2/ec2CPU').CPUStat
var applicationLogs = require('./Backend/web_application_log/logs');
var image = require('./Backend/sts/cloudwatch/s3/image').putImage;
var Line = require('./Backend/notification/SNSLine').SNSLine
var listusercognitor = require('./Backend/sts/Cognitor/Cognitor').Big;

module.exports.listec2 = async (event, context, callback) => {
  var credentials = {
    accessKeyId: event.body.accessKeyId,
    secretAccessKey: event.body.secretAccessKey,
    sessionToken: event.body.sessionToken,
    accountID: event.body.accountID
  }
  const data = await descriptions(credentials);
  var response = {
    statusCode: data.statusCode,
    headers: {
      'Access-Control-Allow-Origin': '*', // Required for CORS support to work
    },
    body: {
      message: data,
    }
  };
  // return response;
  callback(null, response);
};

module.exports.listBuckets = async (event, context, callback) => {

  var credentials = {
    accessKeyId: event.body.accessKeyId,
    secretAccessKey: event.body.secretAccessKey,
    sessionToken: event.body.sessionToken,
    accountID: event.body.accountID
  }

  var responses3 = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },

    body: {
      message: await bucket(credentials)
    }
  };
  callback(null, responses3)

};

let config = {
  body: {
    accessKeyId: "ASIAWQEZB523WUFGBWWS",
    secretAccessKey: "bmUjkAX+/8Y0MSJ8QPNyzq3TD7UbFDBXxO52eF84",
    sessionToken: "AgoGb3JpZ2luENP//////////wEaDmFwLXNvdXRoZWFzdC0xIoACCk1UfKeD/tesmGYM2S4myaHoJ5OWCHRuaW7gZ4xOKEbDYPgDH5WGZ1UQYeY3HU5JlMpGP7aIBpR7hjt/pqOByiFTQ2/lxSw8cGvFgGLaFD+kVkDctygcjWKwr1G2LLt7UqiP11X0AuWMayOU++CL+3Pbi4DVllirSeT5e6xu6HPvYpJwJyR1mue1pnNdnn76Gt9Dot+v55ptpFKWrwOKSEmCyN6NeDtiPEiN2TTYz5zoMbKZbHN8EQd9ucVp1gtGYIUMZjx4mFKGlX/xVxLEZJRmiAOK6tejVTtRHgotjP3R9V8jZt2yrUm942TdiRHJJYKMv5V3peu9LFsQYvveiCrEBQgpEAAaDDQ0Njk5NzU4OTY4NyIMqlFuKHvsRTocF5hIKqEFJIjm0UcfXhNtDK4Bo047MSU9/TK85/ncp0CBgEyNZv46rYyhL53NH4WVGi8XLR0YeR5GKY0rCMI7HNamqLS6yQbSQOeIsI3EuTZ6XxapgvvA1ekvsJu01zPG+vrHbGUA9VS831YyWI212fLzIz2BNxDcZvSw+fI+mY7wMLTjGzMl6ELl5kzysEOKsC/lnZWUWcl5e9UKCtrR8uIFpZwIwwvNI2ASmqp/9gD8k2xyMuitbYf4/2binf+69p0lhV9rpQ3qp2lv2pQdlRhLH2nwq447t54PYTXPndWAZIY2g9Nn6KJrSul2OIb0mrBJZ+6h7FAnbXyHuu8xROX9IoJJzDCQiMLrus7cgHFCLE4GZAR917D8rYu7xrgweOe9AD2+BZnzYc21yqrWF32o2NHQKPSd8RhdQYc1bGRdWBUh3Oo9sXuo7N2IvccDHZle31zD5edtzTx+KuYRHyb45eC0FYeXK90jY4Ci+RQGAQiKGyNc2tbaI4XTcizuv/5T8FwSzU/Yx03IzQPniJEU6aOXUxQJEefVsE5+ISRQByiQBE/u/g3yYrZFOiIL9pkDdnBXI3Ul5eZL5nduCYKWjhus7aF59HnAs80shB+2ueVIRs+A+eu2N7/N2qgOZSiLu6dtZhEb6BKqPJc/q/fe6a0GXV7m3Tj0pn6tY4NamjD/x3nTqIOJsQb52861Y8usgW2YLOgTaQpiMh+q3N+QOe6AlA3MK1+IIoWQ6LGB94gtAzjlnJ/H0+8jmxN6vYnMrNNoLdlx+IE6UlVTBlmENJIz3N57y+TPJnBqWJDHzwRk/6HOUu0h3ItJfy11NMrrK/+CHyVlU1KSDXqbaOv+O46RkWOoHiC/2w80KEVSM75o687oPg0h4Huw0a5AVEVJlyI5rDDhlb3kBQ=="
    , accountID: '427303592433'
    , 
    TimeStart: '2019-02-01T00:00:00.000Z',
    TimeEnd: '2019-02-28T23:59:59.000Z'

  }
}

// log()
// async function log() {

//      console.log(
//        await getMetricData(config
//         )
//         );

//     // await getMetricData(config)

// }

//  async function getMetricData(event) {
module.exports.getMetricData = async (event, context, callback) => {
  
  var listbuckets3 = {
    accessKeyId: event.body.accessKeyId,
    secretAccessKey: event.body.secretAccessKey,
    sessionToken: event.body.sessionToken,
    accountID: event.body.accountID,
    Id: event.body.Id,
    // date: event.body.date,
    timeStart: event.body.TimeStart,
    timeEnd: event.body.TimeEnd
  }

  
const data =  await listbucketcloudwatchs3(listbuckets3)
console.log(event.body.Id);


console.log(data)
  var responses3 = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    body: {
      message: data.filter(Item => Item.BucketName === event.body.Id)
    }
  };
  callback(null, responses3);
  //  return responses3
};

module.exports.CPUStat = async (event, context, callback) => {
  var credentials = {
    accessKeyId: event.body.accessKeyId,
    secretAccessKey: event.body.secretAccessKey,
    sessionToken: event.body.sessionToken,
    accountID: event.body.accountID,
    InstanceId: event.body.InstanceId,
    TimeEnd: event.body.TimeEnd,
    TimeStart: event.body.TimeStart
  }
  console.log(credentials,"TESTTTTTTT")
  var response = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*', // Required for CORS support to work
    },
    body: {
      message: await Ec2CPU(credentials)
    }
  };

  callback(null, response);
};

module.exports.readApplicationLogs = async (event, context, callback) => {

  const schema = Joi.object().keys({
    accountID: Joi.number(),
    date: Joi.string()
  });

  var valided = Joi.validate(event.body, schema);

  var accountID = event.body.accountID;
  var fileName = (event.body.date) ? "ApplicationLogs/" + event.body.date + ".json": null;

  var response = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    body: {
      message: (valided.error == null) ?
        await applicationLogs.readLogs(fileName, accountID):
        "Invalid data."
    }
  }
  
  callback(null, response);
};

module.exports.writeApplicationLogs = async (event, context, callback) => {
  const schema = Joi.object().keys({
    accountID: Joi.number().required(),
    user: Joi.string().alphanum().required(),
    message: Joi.string().required()
  });

  var valided = Joi.validate(event.body, schema);
  
  var response = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    body: {
      message: (valided.error == null) ? 
        await applicationLogs.writeLogs(event.body):
        "Invalid data."
    }
  }

  callback(null, response);
};

module.exports.writeImage = async (event, context, callback) => {
  event.body.files = event.body.files.replace(/^data:image\/\w+;base64,/, '');

  const schema = Joi.object().keys({
    files: Joi.string().base64().min(300).required(),
    type: Joi.string().required(),
    id: Joi.string().min(30).max(40).required()
  });

  const valided = Joi.validate(event.body, schema);
  
  var data = {
    file: new Buffer(event.body.files, 'base64'),
    type: event.body.type,
    projectId: event.body.id
  }

  var response = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*', // Required for CORS support to work
    },
    body: {
      message: valided.error == null ?
        await image(data):
        "Invalid data."
    }
  };
  
  callback(null, response);
};

module.exports.SNSLine = async (event, context, callback) => {

  var credentials = {
    accessKeyId: event.body.accessKeyId,
    secretAccessKey: event.body.secretAccessKey,
    sessionToken: event.body.sessionToken,
    accountID: event.body.accountID
  }

  var responses3 = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    body: {
      message: await Line(credentials)
    }
  };
  // return response;
  callback(null, response);

};

module.exports.ListAllUser = async (event,context,callback) => {
  // async function ListAllUser() {
    var credentials = {
      accessKeyId: event.body.accessKeyId,
      secretAccessKey: event.body.secretAccessKey,
      sessionToken: event.body.sessionToken,
      // accountID: event.body.accountID
    }
    const data = await listusercognitor(credentials);
    var response = {
      statusCode: data.statusCode,
      headers: {
        'Access-Control-Allow-Origin': '*', // Required for CORS support to work
      },
      body: {
        message: data,
      }
    };
    return response;
    // callback(null, response);
  
  };

// var event = {
//   body: {

//     accessKeyId: "ASIAWQEZB523V5HIZRBC",
//     secretAccessKey: "5/uxVwWBw3Y+eG34lg3ITpvZcOgtYqNJe8jjfDRd",
//     sessionToken: 'AgoGb3JpZ2luEBwaDmFwLXNvdXRoZWFzdC0xIoAChRheinbsrQX83tfzt8Qz/H5MvxLy2lV1Y+06v3F0t2qdhR+XGU061+C927kJlqUxw4MKpiILGoj8QQApfaxpiGWsj2bGi2gU4k0bZ2ASmY+Ehnfivkbl7nFcsrhL7OJqBCKbVlahtuAZ4YGgknJaDmqhnrdiQd/PlQle3au9a4quK7h7DwN64kXaXJI7vWAblzryzJvQOX6b+pbaYCvYIcDvx+UK52vTBmxs1KO5MphgC4mHb497pF2nJSxax+Pv6pPLgArqKZEMghOd077Rt5tUS8FzZnxNob433+1HcKRgfusUtKfOfZbywoHc0v7h63GupISBmdM745mL3UVvHSrEBQhxEAAaDDQ0Njk5NzU4OTY4NyIMUp6IT4JoeU8HRuqmKqEF+RbmrOFHLrgKe88D2un4094mpEHog0ijRvaW3zUPV8eYIfymefcLiRhJAl4Pe+5Lv+cjrW6JgnHb1GOI3U6CMnsP/xsHdrG4j5qPpjJaoE6gSGXMKHuXcj0w0Mfu06Jt2gjZI+mu3wgXTsZ7UCAw9EKDEfzKGPWT2ueQ1Xv9Ev04O+NS6bE0a5qZLidqmpcXoCowkQdqEHf6z65fxHOoFzrmhwwMdT4F+JDVPFEBlnHLGFvawJk1yLsbcvGhi2/450cod2102nS3tlLSCIESe0ZPzMt4cAtPgCpbCj8ToEF1QJKNbAErbz77axs8uldfSaZog0FyQ4TeAyXXXZZamRzLznmONJETg+gpztPWi/7d5S7Pm5JMt/8liUl2yptDUrGPa9YcyzOrotVzWsfIU3w8rCW4NUrcyGusAmzqlzqrqN893b9hhgN79IZUwPb2Qz8neuKwS29olPtZ1OCv8DCFHxM2kabZR89pabplD3yq4F7YMuJt++11VlxAtRxK7mMrkRoBIH6UObcZTJGDZTeMfuHLXkgxmLiiBhWFkndwabAjY+2IM1OWr1DqK5tZm1j207B/eRa1ohnYfUvAIij8fM6+ippTpXyHpv1J9ayJfoVcLMD4w/qIXY6eyrvymhNeFU9y2qaqx0M27VS34mS/IuiBgj3zQ2rlKqD8LIANOgHwyqYk1PcLC89o1zlB0dVSW5dih9zzW232UmNA7XE+AblNzoXyHq9IPVThwTkt/6jsQPu0gctEgdxl7gNEtyI7B1dQsntyi36z87+VMX2RYZ+K2RMxHu1SQgJa89mTKTxLrjFs1TmMrdeqGlY1cEe8QPmY6DsAB7Xv7TsTS+mIfx3DGXNBNZs8/GEQ2nXPyUlUfMi9dG8noNQ3LqCcFDDMi83kBQ==',

//   }

// }
// log(event)
// async function log(event) {
//   console.log(
//     await ListAllUser(event)
//     );
// }


