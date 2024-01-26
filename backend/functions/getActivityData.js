// Gets data from an activity
const axios = require('axios')
const stravaAPICall = require('./stravaAPICall')


async function getActivityData(id) {
  const url = `https://www.strava.com/api/v3/activities/${id}`

  const options = {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${process.env.ACCESS_TOKEN}`
    },
    redirect: 'follow'
  }
  // api call to get the activity data
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

module.exports = getActivityData
