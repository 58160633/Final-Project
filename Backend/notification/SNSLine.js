var AWS = require('aws-sdk');
AWS.config.update({region: 'ap-southeast-1'});

const request = require('request')


var string = '55555'
async function snsline() {

request({
    method: 'POST',
    uri: 'https://notify-api.line.me/api/notify',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
    },
    auth: {
        bearer: 'fYcjJrYyBTDc0XDFP4T8JPX0SElxs5b0WK9qNHSPw4c',      //token
        // bearer: 'xLD7xXqpfXEl79xpckuS7U4pOZxdngkh3UEGM70Fzpb'
    },
    form: {
        message: string,       //ข้อความที่จะส่ง
    },
},  (err, httpResponese, body) => {
    if (err) {
        console.log(err);
    } else {
        console.log(body);
        
    }
})


request({
    method: 'POST',
    uri: 'https://notify-api.line.me/api/notify',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
    },
    auth: {
              //token
        bearer: 'xLD7xXqpfXEl79xpckuS7U4pOZxdngkh3UEGM70Fzpb'
    },
    form: {
        message: string,       //ข้อความที่จะส่ง
    },
},  (err, httpResponese, body) => {
    if (err) {
        console.log(err);
    } else {
        console.log(body);
        
    }
})



}
// snsline();

