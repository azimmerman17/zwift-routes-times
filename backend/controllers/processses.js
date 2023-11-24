const router = require('express').Router()
require('dotenv').config()

// DEPENDENCIES 
const getAccessToken = require('../functions/getAccessToken')         // Gets Access Token
const getActivitiesList = require('../functions/getActivitiesList')   // Gets Activity List
const getActivityData = require('../functions/getActivityData')       // Gets Activity Data
const runQuery = require('../functions/runQuery')                     // Runs Querys
const generateMap = require('../functions/generateMap')               // Creates a Map from Queried Data
const getSegmentData = require('../functions/getSegmentData')         // Get Segment Data
const translateDate = require('../functions/translateDate')           // Translate Strava Date

// Check PR time update tables

router.post('/seed_prs', async (req, res) => {
  // return variables
  let activityCount = 0   // total number of activities processed
  let segmentCount = 0    // total number of segments processed
  let countUpdated = 0    // total number of segment effort counts updated

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
  console.log(`Step 3 - Get and process each activity data from Strava API and update Zwift_PR and Yearly PR tables\nEstimated time ${activityCount / 3.5} minutes`)
  // for (let i = 0; i < activityList.length; i++) {
  for (let i = 0; i < activityList.length; i++) {
    // Step 3 Part 1 - Get the activity data from Strava
    console.log(`Processing activity ${i + 1} of ${activityList.length}; Activity: ${activityList[i]}`)
    const activityData = await getActivityData(access_token, activityList[i])
    const { segment_efforts } = activityData
    segmentCount += segment_efforts.length
    console.log('\neffortCount:', segment_efforts.length,'\nsegmentId:', activityList[i])

    // Step 3 Part 2 - Loop through the activities segment efforts and process each segment
    for (let j = 0; j < segment_efforts.length; j++) {
      const { elapsed_time, start_date, segment } = segment_efforts[j]
      const effort_date = translateDate(start_date.split('T')[0])
      const effort_id = segment_efforts[j].id
      const { id } = segment

      // Step 3 Part 3 - Check the Zwift_PR Table to see if the segement is tracked
      // Query to get the PR data from the Zwift_PR table
      const prQuery = `SELECT * FROM public."Zwift_PRs"
      WHERE strava_id = ${id}
      LIMIT 1`

      //run the prQuery
      const prData = await runQuery(prQuery)
      
      if (prData === null) {
        // if prData is null, the segment is not tracked
        console.log(`Segment ${id} is not tracked`)
        continue
      }
      // Step 3 Part 4 - Create map with returned data and set varibles for update query
      const prMap = generateMap(prData[0])
      console.log(prMap)

      // Varables for update query
      const pr_time = prMap.get('pr_time')
      const pr_date = prMap.get('pr_date')
      const pr_effort_id = prMap.get('pr_effort_id')
      const silver_time = prMap.get('silver_time')
      const silver_date = prMap.get('silver_date')
      const silver_effort_id = prMap.get('silver_effort_id')
      const bronze_time = prMap.get('bronze_time')
      const bronze_effort_id = prMap.get('bronze_effort_id') 

      // update the last effort date
      const effortDateQuery = `UPDATE public."Zwift_PRs"
      SET last_effort_time =  ${elapsed_time},
        last_effort_date = '${effort_date}',
        updated_at = NOW()
      WHERE strava_id = ${id}`
      console.log('\nUPDATE QUERY\n', effortDateQuery)
      await runQuery(effortDateQuery)

      // Step 3 Part 5 - Validate if effort is already in a Top 3 PR, and update table appropriately
      if (pr_effort_id == effort_id || silver_effort_id == effort_id || bronze_effort_id == effort_id) {
        // Check if the effort is already on PR table - if yes only update last effort data
        console.log('Effort is already a PR')
      } else if (!pr_time || pr_time > elapsed_time) {
        // update table if the effort is a PR
        console.log('New PR')
        const updateQuery = `UPDATE public."Zwift_PRs"
          SET pr_time =  ${elapsed_time},
            pr_date = '${effort_date}',
            pr_effort_id = '${effort_id}', 
            silver_time = ${pr_time},
            silver_date = ${pr_date === null ? null : `'${pr_date}'`},
            silver_effort_id = ${pr_effort_id},
            bronze_time = ${silver_time},
            bronze_date = ${silver_date === null ? null : `'${silver_date}'`},
            bronze_effort_id = ${silver_effort_id},
            updated_at = NOW()
          WHERE strava_id = ${id}`
          console.log('\nUPDATE QUERY\n', updateQuery)
          await runQuery(updateQuery)
      } else if (!silver_time || silver_time > elapsed_time) {
        // update table if the effort is a second best PR
        console.log('New Silver')
        const updateQuery = `UPDATE public."Zwift_PRs"
        SET silver_time = ${elapsed_time},
          silver_date = '${effort_date}',
          silver_effort_id = ${effort_id},
          bronze_time = ${silver_time},
          bronze_date = ${silver_date === null ? null : `'${silver_date}'`},
          bronze_effort_id = ${silver_effort_id},
          updated_at = NOW()
        WHERE strava_id = ${id}`
        console.log('\nUPDATE QUERY\n', updateQuery)
        await runQuery(updateQuery)
        console.log('Zwift PR Updated')
      } else if (!bronze_time || bronze_time > elapsed_time) {
      // update table if the effort is a third best PR
        console.log('New Bronze')
        const updateQuery = `UPDATE public."Zwift_PRs"
        SET bronze_time = ${elapsed_time},
          bronze_date = '${effort_date}',
          bronze_effort_id = ${effort_id},
          updated_at = NOW()
        WHERE strava_id = ${id}`
        console.log('\nUPDATE QUERY\n', updateQuery)
        await runQuery(updateQuery)
      } else {
        console.log('\nNot a new benchmark')
      }
      // Step 3 Part 6 - Validate if effort is already in the Yearly_PR Table
      console.log('\nMoving to the YEARLY_PR Table')
      // Check if the Segment is already on the Yearly_PR table
      let year = Number(effort_date.split('-')[0])
      const yearQuery = `SELECT * FROM public."Yearly_PRs"
      WHERE strava_id = ${id}
        AND year = ${year}`
      console.log('\nYEARLY PR QUERY\n', yearQuery)

      const yearlyData = await runQuery(yearQuery)
      console.log('\nYEARLY_PR', yearlyData)

      if (yearlyData === null) {
        // If data is null, INSERT a new row
        console.log(`First PR for Strava Segment, ${id} in year, ${year}`)
        const insertQuery = `INSERT INTO public."Yearly_PRs" (strava_id, year, pr_time, pr_date, pr_effort_id, created_at, updated_at)
          VALUES (${id}, ${year}, ${elapsed_time}, '${effort_date}', ${effort_id}, NOW(), NOW())`
        console.log('\nINSERT QUERY\n', insertQuery)
        await runQuery(insertQuery)
      } else {
        // If exist on table, check if time is a new PR
        const yearMap = generateMap(yearlyData[0])
        console.log('\nZWIFT_PR DATA\n', yearMap)
        if (elapsed_time < yearMap.get('pr_time')) {
          console.log(`New PR for Strava Segment, ${id} in year, ${year}`)
          updateQuery = `UPDATE public."Yearly_PRs"
            SET pr_time = ${elapsed_time},
              pr_date = '${effort_date}',
              pr_effort_id = ${pr_effort_id},
              updated_at = NOW()
            WHERE strava_id = ${id}
              AND year = ${year}`
          console.log('\nYEARLY PR Upate Query\n', updateQuery)
          await runQuery(updateQuery)
        } else {
          console.log('Effort is not a new PR')
        }
      }
      console.log(`Processing activity ${i + 1} of ${activityList.length}; Activity: ${activityList[i]}`)
      console.log(`Processing of segment ${j + 1} of ${segment_efforts.length} - Complete`)
    }       // end segment loop

    // Step 3 Part 7 - Pause for Rate Limit
    // pause process due to Strava Rate Limits - 1000 per day, 100 per 15 minutes - only process a max of 60 over the 15 minutes 
    console.log(`Processing activity ${i + 1} of ${activityList.length}; Activity: ${activityList[i]} - Completed`)
    console.log('Pausing for 15 seconds due to Strava API call limits')
    await new Promise(r => setTimeout(r, 15000));
  }       // end activity loop


  // Step 4 - Update the Segment Effort Counts
  // Step 4 Part 1- Get a list of strava_ids with PR data attached
  const selectQuery = `SELECT A.strava_id
  FROM public."Zwift_PRs" A
  WHERE A.pr_time is not null`

  const segmentList = await runQuery(selectQuery)
  countUpdated = segmentList.length
  console.log(`${countUpdated} segments that need to be updated `)
  
  // Step 4 Part 2 - Loop through the rows to get a segment effort count
  for (let k = 0; k < segmentList.length; k++) {
    let stravaId = segmentList[k][`strava_id`]
    const segmentData = await getSegmentData(stravaId, access_token)
    const { athlete_segment_stats } = segmentData
    const { effort_count } = athlete_segment_stats
    console.log('\n Athlete Stats\n', athlete_segment_stats)

    // Step 4 Part 3 - Update the Zwift_PR Table
    const updateQuery = `UPDATE public."Zwift_PRs"
      SET count = ${effort_count},
        updated_at = NOW()
      WHERE strava_id = ${stravaId}`

    console.log('\nYEARLY PR Upate Query - Updating Count\n', updateQuery)
    await runQuery(updateQuery)

    // Step 4 Part 4 = Pause for Rate Limit
    console.log(`Updated Count for Segment ${stravaId} - Segment ${k + 1} of ${countUpdated}`)
    console.log('Pausing for 15 seconds due to Strava API call limits')
    await new Promise(r => setTimeout(r, 15000));
  }       // end loop Update Counts
  // end the process
  console.log('Process Complete- Seed Zwift_PR Table and Yearly_PR Table\n', {
    activityCount,
    segmentCount,
    countUpdated
  })

  res.send({
    activityCount,
    segmentCount,
    countUpdated
  })
})

module.exports = router