const axios = require('axios')
const getAccessToken = require('./getAccessToken')
require('dotenv').config()

async function stravaAPICall(url, options, method) {
  let response
  if (method === 'GET') response = await axios.get(url, options) 
  else if (method === 'POST') response = await axios.post(url, options) 

  const { data, status } = response

  // Validate status Codes
  switch (status) {
    case 200: 
      return data
    case 401:
      // 401 Unauthorized -- Expired Access Token (AT), retrieve new AT - retry
      process.env.ACCESS_TOKEN = await getAccessToken()
      const response = await stravaAPICall(url, options, method)
      return response
    case 403:
      // 403 Forbidden; you cannot access -- Skip (Do not see this happening within scope of this project)
      console.log('403 Forbidden; you cannot access')
    case 404:
      // 404 Not found; the requested asset does not exist, or you are not authorized to see it -- Check the scope of the AT 
    case 429:
      // 429 Too Many Requests; you have exceeded rate limits -- Will have to wait to continue
      // check if its 15min limit or daily exceeded
      // if 15min wait
      // if daily - quit
    case 500:
      // 500 Strava is having issues, please check https://status.strava.com - - kill the process
      default:
        return data
  }
}

module.exports = stravaAPICall
// 401 Unauthorized
  // -- New access Token
// 403 Forbidden; you cannot access
  // -- locked down content, continue
// 404 Not found; the requested asset does not exist, or you are not authorized to see it
  // -- Does not exist within sope, skip
// 429 Too Many Requests; you have exceeded rate limits
  // wait and try again
// 500 Strava is having issues, please check https://status.strava.com
  // Strava is down -- kill
