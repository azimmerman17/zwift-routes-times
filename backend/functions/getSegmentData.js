// get data for selected segment
const axios = require('axios')
require('dotenv').config()

async function getSegmentData(segmentId, accessToken) {
  const options = {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`
    },
    redirect: 'follow'
  }

  let url = `https://www.strava.com/api/v3/segments/${segmentId}`
  try {
    const response = await axios.get(url, options) 
    const { data } = response
    return data
  } catch (error) {
    console.log(error)
    return error
  }
}

module.exports = getSegmentData