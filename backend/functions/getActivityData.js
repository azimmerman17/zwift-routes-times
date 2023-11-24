// Gets data from an activity
const axios = require('axios')

async function getActivityData(access_token, id) {
  const url = `https://www.strava.com/api/v3/activities/${id}`

  const options = {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${access_token}`
    },
    redirect: 'follow'
  }
  // api call to get the activity data
  try {
    const response = await axios.get(url, options) 
    const { data } = response
    return data
  } catch (error) {
    console.log(error)
    return error
  }

}

module.exports = getActivityData
