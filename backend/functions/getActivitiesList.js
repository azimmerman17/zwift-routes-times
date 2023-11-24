// get a list of activities 
const axios = require('axios')

async function getActivitiesList(access_token) {
  let activityList = []
  let flag = 1            // flag to end the loop
  let page = 1            // start page for the Strava API calls
  let per_page = 200      // total activities for each page of API Call (200 max)

  const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${access_token}`
      },
      redirect: 'follow'
  }

  // while loop to get all the activities - max 200 per page
  while (flag === 1) {
    let url = `https://www.strava.com/api/v3/activities/?page=${page}&per_page=${per_page}`
    try {
      const response = await axios.get(url, options) 
      const { data } = response
      data.forEach(record => {
        const { type, id, name, external_id } = record
        let add = 0

        // only check for Virtual Rides
        if (type === 'VirtualRide') {
          for (let s = 0; s < name.length; s++) {
            // if the name contains Zwift - add to the list
            if (name.substr(s, s + 5).toLowerCase() == 'zwift') {
              add = 1
              s = name.length
            }
            // if the external id contains Zwift - add to the list
            if (external_id.substr(s, s + 5).toLowerCase() == 'zwift') {
              add = 1
              s = name.length
            }
          }
        }
        
        // add activity to the front of the list. 
        // Zwift calls newest to oldest.  We want to process the oldest first 
        if (add === 1) activityList.unshift(id)
      });
    
    // move to next page 
    page += 1
    // if the list is not maxed out, end the loop (no activities left)
    if (data.length < per_page) flag = 0
    } catch (error) {
      console.log(error)
      return error
    }
  }
  return activityList
}

module.exports = getActivitiesList
