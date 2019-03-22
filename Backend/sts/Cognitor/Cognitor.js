var AWS = new require('aws-sdk')
// var requestSTS = require('../requestSTS').requestSTS;

async function Big(credentials) {


  // var credentials = await requestSTS(event); //ขอกุญแจ

  var cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider({
    region: 'ap-southeast-1',
    accessKeyId: credentials.accessKeyId,            //รอจากหน้าบ้านส่งมาให้
    secretAccessKey: credentials.secretAccessKey,    //รอจากหน้าบ้านส่งมาให้
    sessionToken: credentials.sessionToken           //รอจากหน้าบ้านส่งมาให้
  });

  // if(credentials !== ){
  //   return 'No Permission'
  // }else {

  // }


  /*Check Permission If (No Permission) {
  
  }return Nopermission
  */

  //listGroup
  async function listnamegroup() {
    var params = {
      UserPoolId: 'ap-southeast-1_WhJDN2wo3'
    };
    return new Promise((resolve) => {
      cognitoidentityserviceprovider.listGroups(params, function (err, data) {
        if (err) {


          resolve(err); // an error occurred
        }
        else {
          resolve( data);

        }
      });
    });
  }

  function GroupCognitor(data) {
    var listgroup = [];
    for (var i = 0; i < data.Groups.length; i++) {
      listgroup[i] = data.Groups[i].GroupName
    }
    return listgroup
  }

  async function listCognitor(group) {
    var params = {
      GroupName: group,
      UserPoolId: 'ap-southeast-1_WhJDN2wo3',
    };
    return new Promise((resolve) => {
      cognitoidentityserviceprovider.listUsersInGroup(params, function (err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else resolve(data)          // successful response
      });
    });
  }

  async function ListAllUser() {

    var data = await listnamegroup();

    if (data.statusCode == undefined) {

      // console.log("data", data);

      var listgroup = GroupCognitor(data);
      var listuser = [];

      for (var i = 0; i < listgroup.length; i++) {
        listuser[i] = await listCognitor(listgroup[i]);
      }

      var user = [];
      for (var i = 0; i < listuser.length; i++) {
        var temp = [];
        for (var j = 0; j < listuser[i].Users.length; j++) {
          temp[j] = {
            "Username": listuser[i].Users[j].Username,
            "UserCreateDate": listuser[i].Users[j].UserCreateDate,
            "GroupName": listgroup[i]
          };
        }
        user = user.concat(temp);
      }
      // console.log(user)
      return user;

    } else {

      return data.message

    }
  }
  return await ListAllUser();
}
module.exports = { Big }