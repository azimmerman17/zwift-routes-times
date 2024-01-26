// get data for selected segment
const axios = require('axios')
const stravaAPICall = require('./stravaAPICall')
require('dotenv').config()

async function getSegmentData(segmentId) {
  const options = {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${process.env.ACCESS_TOKEN}`
    },
    redirect: 'follow'
  }

  let url = `https://www.strava.com/api/v3/segments/${segmentId}`
  try {
    const data = await stravaAPICall(url, options, 'GET')
    // const response = await axios.get(url, options) 
    // const { data } = response
    return data
  } catch (error) {
    console.log(error)
    return error
  }
}

module.exports = getSegmentData