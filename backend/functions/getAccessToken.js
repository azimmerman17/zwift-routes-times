// get the access token to get activity efforts
const axios = require('axios')
const stravaAPICall = require('./stravaAPICall')
require('dotenv').config()

async function getAccessToken() {
  // env varibles 
  const client_id = process.env.STRAVA_CLIENT_ID
  const client_secret = process.env.STRAVA_CLIENT_SECERT
  const refresh_token = process.env.STRAVA_RF_TOKEN
  
  // url for the token exchange
  const tokenExchangeUrl = 'https://www.strava.com/oauth/token'
  const params = `?client_id=${client_id}&refresh_token=${refresh_token}&client_secret=${client_secret}&grant_type=refresh_token`

  const url = tokenExchangeUrl + params

  const options = {
    method: 'POST',
    headers: {
      client_id,
      client_secret,
      refresh_token,
      grant_type: 'refresh_token'
    },
    redirect: 'follow'
  }

  try {
    const data = await stravaAPICall(url, options, 'POST')

    // const response = await axios.post(url, options) 
    // const { data } = response
    const { access_token } = data
    process.env.ACCESS_TOKEN = access_token
    // return access_token
  } catch (error) {
    console.log(error)
    // return error
  }
}

module.exports = getAccessToken
