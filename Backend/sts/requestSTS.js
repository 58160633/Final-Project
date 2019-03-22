var AWS = require('aws-sdk')
async function requestSTS(key) {
    var sts = new AWS.STS({
        accessKeyId: key.accessKeyId,//key.body.accessKeyId,
        secretAccessKey: key.secretAccessKey,//key.body.secretAccessKey,
        sessionToken: key.sessionToken//key.body.sessionToken
    });
    var accountID = key.accountID//event.body.accountID
    const credentials = async () => {
        return new Promise((resolve) => {
            sts.assumeRole({
                RoleArn: `arn:aws:iam::${accountID}:role/SentinelCognito-ReadOnly`,
                RoleSessionName: 'awssts'
            }, (err, data) => {
                if (err) {      // an error occurred
                    resolve(err)
                } else { // successful response

                    resolve(data)
                }
            })
        })
    }
    let data = await credentials()
    
    if (data.Credentials != undefined) {
        return {
            statusCode: 200,
            message: data
        }
    } else {
        return {
            statusCode: 400,
            message: "No key"
        }
    }
}



// let config = {
//     accessKeyId: "ASIAWQEZB523WBJ23234",
//     secretAccessKey: "e6Jg9fYeDAJogOmI1ua2sZqmI9ozt0XxeCETNjTJ",
//     sessionToken: "AgoGb3JpZ2luENP//////////wEaDmFwLXNvdXRoZWFzdC0xIoACN3hCkHQYU9oBzqhCfvpkDSeIlCEI51if1O8Dm8oiyanV8tFTBhW1JjvO3QzW85xSiog7fUe51BgEhNd/UFqrCER/CYxxtfV5dQ29XN2675k2LNL0f/3uNeh2aMSdIU8wIkPIhVIhOJsQx+vamMDKx1t4KbFjeG7ZQnQg2uaUt9w0fxZugimRUAV+pSRNbtZ3It8Bf7NZED/fjmZU4Yfp2BSxM1lJgF+qNpTX1QoRQQYKNahUoozObAkqpuyGiT2JNScjL+VUHAZSQTdF9je6AhUwHuWU61Ls0+1I1bTC1V29S1ETlk5dfV+uzOk03XNVcaO9616kJPvDATWb/VkiqyrEBQgoEAAaDDQ0Njk5NzU4OTY4NyIM3M+nVOYFWD0WX70HKqEF2gqYOhBU03FAnrAa8+wAyiFeZNVB42VivWl1KtkNXViO2aUeYwlY6dxRyxKD57mVwBtjah3Qj3lOfmgTLfXEj8wdg4vK9RJohgZU/njiYbje5ZBOjLgtZqRgdm8mpfe8A0nUEJYzYrIiZra+czVOPQ1e9if6lm/R/UvtB4i1BsybtlVpB8VzmxrMCn+NxPHrweapFtFjkTvdpeq+vOi+uAGhKO9xECgaUFC153ZiJlEHBOuoxMt4EXks0asZsTrZxYl6wKn0zXOanBBoyblcfqkRXGiNcldcVNoMBFJimMf4MwE2q9/zsJ3ZYXYnmx62PZPqCRDWspFzNzZnok2E2rUqH83v1SUaVFVTR7OoE8isxtTbcL0lPp6ARvpnBuCWahXLMx98SIIj1haW/15OcZfj0wBFMu+6dc6jJO3ZW2UYpO8xhQ2jItCUv0m4PWSO75imp6wrKbUBL006cYLrs80qPSBPv0z3w3yPJXm7+k8juBDHLTWuhCGPHhE+FMXcNTkfYnZBJvNkzUU5ax3KrNMTTBYx3C+++lRK1CGCeSRcxDTP/+BLKWBxW3k6vqmamEx8jUV5WSXun6zfEgxnGDx1VAZDAf6R+lfv7DcUSny8IzXdAAV+maRCBkwO1IUdvP5EAIZkk3PKXfwM3Pf5f/2MYVcoayuXoOJyTF6AwHZdEwKQd7s6IabITdJWEDyQamI7yPychYIBcp9N/2I3cF9JQKM47DjT43RdhAY/h0C5+ii8NuV3IXxbtRxQbtAbIgRwz9JsTiDJ803O5H8+CwWgVp9FiPRG79Eyff64IFXDg0dNRvccyxAnjfXvJTNQcF+01gSg/ZZaRCdCBkVk9d3s9lzITj3OOHbzxELeN4uiRFWnm/yjrOsmORcxD4O9WzDVjb3kBQ=="
//     , accountID: '254438134974'
// }


module.exports = { requestSTS }

