// get a list of activities 
const axios = require('axios')

async function getActivitiesList(access_token) {
  let activityList = []
  let flag = 1
  let page = 1

  const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${access_token}`
      },
      redirect: 'follow'
  }

  // while loop to get all the activities - max 200 per page
  while (flag === 1) {
    let url = `https://www.strava.com/api/v3/activities/?page=${page}&per_page=200`
    try {
      const response = await axios.get(url, options) 
      const { data } = response
      data.forEach(record => {
        const { type, id, name, external_id } = record
        let flag = 0

        if (type === 'VirtualRide') {
          for (let s = 0; s < name.length; s++) {
            if (name.substr(s, s + 5).toLowerCase() == 'zwift') {
              flag = 1
              s = name.length
            }
           if (external_id.substr(s, s + 5).toLowerCase() == 'zwift') {
              flag = 1
              s = name.length
            }
          }
        }
        
        if (flag === 1) activityList.unshift(id)
      });
    
    // move to next page 
    page += 1
    // if the list is not maxed out, end the loop (no activities left)
    if (data.length < 200) flag = 0
    } catch (error) {
      console.log(error)
      return error
    }
  }
  return activityList
}

module.exports = getActivitiesList
