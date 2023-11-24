const router = require('express').Router()
require('dotenv').config()

// DEPENDENCIES 
const getAccessToken = require('../functions/getAccessToken')         // get Activity List
const getActivitiesList = require('../functions/getActivitiesList')   // get Activity Data
// get Segment Data
// run Querys
// translate Strava Date

// Check PR time update tables

router.post('/seed_prs', async (req, res) => {
  // return variables
  let activityCount = 0
  let segmentCount = 0

  // Step 1 - Retrieve Access Token
  console.log('Step 1 - Retrieve Access Token')
  const access_token = await getAccessToken()
  console.log('\nRetrieved Access token\n')
  // console.log('Retrieved Access token\n', access_token)    // testing ONLY
  
  
  // Step 2 - Get all Strava activities and create a list of activity id's of Virtual Rides
  console.log('Step 2 - Get all Strava activities and create a list of activity id\'s of Virtual Rides')
  let activityList = await getActivitiesList(access_token)
  activityCount = activityList.length
  console.log(activityList)

  // Step 3 - Get and process each activity data from Strava API and update Zwift_PR and Yearly PR tables
      // Step 3 Part 1 - Get the activity data from Strava
      // Step 3 Part 2 - Loop through the activities segment efforts and process each segment
      // Step 3 Part 3 - Check the Zwift_PR Table to see if the segement is tracked
      // Step 3 Part 4 - Create map with returned data and set varibles for update query
      // Step 3 Part 5 - Validate if effort is already in a Top 3 PR, and update table appropriately
      // Step 3 Part 6 - Validate if effort is already in the Yearly_PR Table, and update table appropriately
      // Step 3 Part 7 - Pause for Rate Limit

  // Step 4 - Update the Segment Effort Counts
    // Step 4 Part 1- Get a list of strava_ids with PR data attached
    // Step 4 Part 2 - Loop through the rows to get a segment effort count
    // Step 4 Part 3 - Update the Zwift_PR Table
    // Step 4 Part 4 = Pause for Rate Limit
})

module.exports = router