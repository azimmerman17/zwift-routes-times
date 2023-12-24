const router = require('express').Router()
require('dotenv').config()

// dependencies
const runQuery = require('../functions/runQuery')       // Runs Querys
const generateMap = require('../functions/generateMap')
const calcAvgGrade = require('../functions/calcAvgGrade')
const calcClimbCat = require('../functions/calcClimbCat')

// GET
// GET all routes
router.get('/', async (req, res) => {
  const selectQuery = `SELECT A.strava_id,
      A.segment_name,
      A.zi_link,
      A.world_id,
      A.length,
      A.ele_gain,
      A.grade,
      A.type,
      A.climb_cat,
      B.count,
      B.last_effort_time,
      B.last_effort_date,
      B.pr_time,
      B.pr_date,
      B.silver_time,
      B.silver_date,
      B.bronze_time,
      B.bronze_date
    FROM public."Segments" A 
    LEFT JOIN public."Zwift_PRs" B
      ON A.strava_id = B.strava_id;`

  try {
    const segments = await runQuery(selectQuery)
    if (segments.error) res.status(500).send({segments, table: 'Segments'})
    else res.status(200).send(segments)
  } catch (error) {
    res.status(500).send(error)
  }
})

// GET segment by id
router.get('/:id', async (req, res) => {
  const { id } = req.params
  const selectQuery = `SELECT A.strava_id,
      A.segment_name,
      A.zi_link,
      A.world_id,
      A.length,
      A.ele_gain,
      A.grade,
      A.climb_cat,
      A.type as segment_type,
      B.type,
      B.count,
      B.last_effort_time,
      B.last_effort_date,
      B.pr_time,
      B.pr_date,
      B.silver_time,
      B.silver_date,
      B.bronze_time,
      B.bronze_date
    FROM public."Segments" A
    LEFT JOIN public."Zwift_PRs" B
      ON A.strava_id = B.strava_id
    WHERE A.strava_id = ${Number(id) ? id : null}
      OR A.zi_link = '${id.toLowerCase()}';`

  try {
    const segment = await runQuery(selectQuery)
    
    if (segment === null) res.status(404).send('Invaild Segment')
    else if (segment.error)  res.status(500).send({segment, table: 'Segment'})
    else {
      const { strava_id } = segment[0]
      
      const selectYearQuery = `SELECT A.strava_id,
          A.year,
          A.pr_time as yr_pr_time,
          A.pr_date as yr_pr_date
        FROM public."Yearly_PRs" A
        WHERE A.strava_id = ${Number(id) ? id : strava_id};`

      const year = await runQuery(selectYearQuery)
      if (year.error) res.status(500).send({year, table: 'Yearly_PRs'})
      else {
        res.status(200).send({
          segment,
          year
        })
      }
    }
  } catch (error) {
    res.status(500).send(error)
  }
})

// POST
// POST A NEW ROUTE
router.post('/', async (req, res) => {
  // Validate the required data is present
  const { strava_id, segment_name, zi_link, world_id, length, ele_gain, type, avg_grade } = req.body
  if (type === 'KOM') {
    if (!strava_id,!segment_name, !zi_link, !world_id, !length, !type, !ele_gain) res.status(400).send('Invalid request - Required fields not entered')
    else {
      const komQuery =`INSERT INTO public."Segments" ( strava_id, segment_name, zi_link, world_id, length, ele_gain, grade, climb_cat, type, created_at, updated_at)
      VALUES (${strava_id},
        '${segment_name}',
        '${zi_link}',
        ${world_id},
        ${Number(length).toFixed(2)},
        ${Math.floor(ele_gain)},
        ${calcAvgGrade(length, ele_gain)},
        ${calcClimbCat(length,ele_gain)},
        'kom',
        NOW(),
        NOW());`

      let result = await runQuery(komQuery)
      if (result.error) res.status(500).send({result, table: 'Segments'})
      else {
        // POST to ZWIFT_PR TABLE
        const prQuery = `INSERT INTO public."Zwift_PRs" (strava_id, type, created_at, updated_at)
          VALUES (${strava_id},
            'segment',
            NOW(),
            NOW());`
        result = await runQuery(prQuery)
        if (result.error) res.status(500).send({result, table: 'Zwift_PRs'})
        else res.status(200).send('KOM Segment added')
      }
    }
  } else { // KOM else
    if (!segment_name, !zi_link, !world_id, !length, !type) res.status(400).send('Invalid request - Required fields not entered')
    else {
      let sprintIdQuery  = `SELECT MAX(strava_id) FROM public."Segments"
        WHERE strava_id < 10000`
        
      const data = await runQuery(sprintIdQuery)
      if (data.error)  res.status(500).send({data, table: 'Segments'})
      else {
        let sprintId = Number(data[0]['max']) + 1
        const sprintQuery = `INSERT INTO public."Segments" (strava_id, segment_name, zi_link, world_id, length, ele_gain, grade, climb_cat, type, created_at, updated_at)
          VALUES (${sprintId},
            '${segment_name}',
            '${zi_link}',
            ${world_id},
            ${Number(length).toFixed(2)},
            ${Math.floor(ele_gain)},
            ${avg_grade ? avg_grade : 0},
            'S',
            'sprint',
            NOW(),
            NOW());`

        let result = await runQuery(sprintQuery)
        if (result.error) res.status(500).send({result, table: 'Zwift_PRs'})
        else res.status(200).send('Sprint Segment added')
      }
    }
  }
  // Do not seed the tables, seed in bulk due to API call restrictions
})

// PUT
// Edit data on the segment - ONLY can be edited on the STRAVA ID
router.put('/:id', async (req,res) => {
  const { id } = req.params
  const { segment_name, zi_link, world_id, length, ele_gain, type } = req.body

  //  Get data from the database
  const selectQuery = `SELECT length, ele_gain, type FROM public."Segments"
    WHERE strava_id = ${id}`

  const currData = await runQuery(selectQuery)
  if (currData.error) res.status(500).send({currData, table: 'Segments'})
  else {
  const dataMap = generateMap(currData[0])

  const currLen = dataMap.get('length')
  const currEle = dataMap.get('ele_gain')
  const currType = dataMap.get('type')

  let newLen
  let newEle
  let newCat
  let newGrade

  //  Build the update query
  let updateQuery = `UPDATE public."Segments"
    SET updated_at = NOW()`

  if (segment_name !== undefined) {
    updateQuery = `${updateQuery},
    segment_name = '${segment_name}'`
  }
  if (zi_link !== undefined) {
    updateQuery = `${updateQuery},
    zi_link = '${zi_link}'`
  }
  if (world_id !== undefined) {
    updateQuery = `${updateQuery},
    world_id = '${world_id}'`
  }
  if (length !== undefined) {
    updateQuery = `${updateQuery},
    length = '${Number(length).toFixed(2)}'`
    newLen = length
  } else {
    newLen = currLen
  }
  if (ele_gain !== undefined) {
    updateQuery = `${updateQuery},
    ele_gain = '${Math.floor(ele_gain)}'`
    newEle = ele_gain
  } else {
    newEle = currEle
  }
  if (type !== undefined) {
    updateQuery = `${updateQuery},
    type = '${type}'`
  }
  if (type === 'kom') {
    newCat = calcClimbCat(newLen, newEle)
    newGrade = calcAvgGrade(newLen, newEle)
    updateQuery =  `${updateQuery},
    climb_cat = '${newCat}',
    grade = ${newGrade}`
  } else {
    newCat = 'S'
    newGrade = 0
    updateQuery =  `${updateQuery},
    climb_cat = '${newCat}',
    grade = ${newGrade}`
  }

  // Add WHERE clause
  updateQuery = `${updateQuery}
  WHERE strava_id = ${id};`


  let result = await runQuery(updateQuery)
  if (result.error) res.status(500).send({result, table: 'Segments'})
    else {
      if (type === 'sprint' && currType === 'kom') {
        // delete Zwift_Pr and Yearly_Pr record
        const deleteZwiftQuery = `DELETE FROM public."Yearly_PRs" 
          WHERE strava_id = ${id};`
        await runQuery(deleteZwiftQuery)

        const deleteYearlyQuery = `DELETE FROM public."Yearly_PRs" 
         WHERE strava_id = ${id};`
        await runQuery(deleteYearlyQuery)

        res.status(200).send('Complete')
      } else if (type === 'kom' && currType === 'sprint'){
        // create Zwift_Pr record 
        const prQuery = `INSERT INTO public."Zwift_PRs" (strava_id, type, created_at, updated_at)
          VALUES (${id},
            'segment',
            NOW(),
            NOW());`
        result = await runQuery(prQuery)
        if (result.error) res.status(500).send({result, table: 'Zwift_PRs'})
        else res.status(200).send('Complete')
      } else res.status(200).send('Complete')  
    }
  }
})

// Edit strava id on the segment - ONLY can be edited on the STRAVA ID - CASCADE to PR tables
router.put('/strava/:id', async (req,res) => {
  const { id } = req.params
  const { strava_id } = req.body

  // Validate the Strava id - needs to be updated 
  if (!strava_id) res.status(400).send('No Strava Id sent')
  else if (strava_id === id) res.status(400).send('Strava Id matched current Id')
  else {
    // Update the Routes Table
    const routesQuery = `UPDATE public."Segments"
      SET strava_id = ${strava_id},
      updatedAt = NOW()
      WHERE strava_id = ${id};`
    await runQuery(routesQuery)

    // Update the Zwift_PRs Table - remove effort data
    const prQuery = `UPDATE public."Zwift_PRs"
      SET strava_id = ${strava_id},
        count = null,
        last_effort_time = null,
        last_effort_date = null,
        pr_time = null,
        pr_date = null,
        pr_effort_id = null,
        silver_id = null,
        silver_date = null,
        silver_effort_id = null,
        bronze_time = null,
        bronze_date = null,
        bronze_effort_id = null,
        updatedAt = NOW()
      WHERE strava_id = ${id};`
    await runQuery(prQuery)

    // Remove all instances from the Yearly_PR table
    const yearQuery = `DELETE FROM public."Yearly_PRs" 
      WHERE strava_id = ${id};`
    await runQuery(yearQuery)
    // Do not seed the tables, seed in bulk due to API call restrictions
  }
  res.status(200).send('Complete')
})

// DELETE
// DELETE a route 
router.delete('/:id', async (req, res) => {
  const { id } = req.params
  // remove segment from Segments Table
  const deleteRoutesQuery = `DELETE FROM public."Segments" 
    WHERE strava_id = ${id};`
  await runQuery(deleteRoutesQuery)
  
  // remove segment from Zwift_PR Table
  const deletePRQuery = `DELETE FROM public."Zwift_PRs" 
    WHERE strava_id = ${id};`
  await runQuery(deletePRQuery)

  // remove segment from Yearly_PR Table
  const deleteYearlyQuery = `DELETE FROM public."Yearly_PRs" 
    WHERE strava_id = ${id};`
  await runQuery(deleteYearlyQuery)

  res.status(200).send('Complete')
})

module.exports = router
