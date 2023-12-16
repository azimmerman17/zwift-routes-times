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
    res.status(200).send(segments)
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
      B.bronze_date,
    FROM public."Segments" A
    LEFT JOIN public."Zwift_PRs" B
      ON A.strava_id = B.strava_id
    WHERE A.strava_id = ${Number(id) ? id : null}
      OR A.zi_link = '${id.toLowerCase()}';`

  const selectYearQuery = `SELECT A.strava_id,
      A.year,
      A.pr_time as yr_pr_time,
      A.pr_date as yr_pr_date
    FROM public."Yearly_PRs" A
    WHERE A.strava_id = ${Number(id) ? id : null}
      OR A.zi_link = '${id.toLowerCase()}';`

  try {
    const segment = await runQuery(selectQuery)
    const year = await runQuery(selectYearQuery)
    res.status(200).send({
      segment,
      year
    })
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

      const komQuery =`INSERT INTO public."Segments" ( strava_id, segment_name, zi_link, world_id, length, ele_gain, grade, climb_cat, type, createdAt, updatedAt)
      VALUES (${strava_id},
        ${segment_name},
        ${zi_link},
        ${world_id},
        ${length},
        ${ele_gain},
        ${calcAvgGrade(length, ele_gain)},
        ${calcClimbCat(length,ele_gain)},
        'kom',
        NOW(),
        NOW());`

      await runQuery(komQuery)

      // POST to ZWIFT_PR TABLE
      const prQuery = `INSERT INTO public."Zwift_PRS" (strava_id, type, createdAt, updatedAt)
        VALUES (${strava_id},
          'segment',
          NOW(),
          NOW());`
      await runQuery(prQuery)
    } else {
      if (!segment_name, !zi_link, !world_id, !length, !type) res.status(400).send('Invalid request - Required fields not entered')

      let sprintIdQuery  = `SELECT MAX(strava_id) FROM public."Segments"
        WHERE strava_id < 10000`

      const data = await runQuery(sprintIdQuery)
      let sprintId = Number(data[0]) + 1

      const sprintQuery = `INSERT INTO public."Segments" ( strava_id, segment_name, zi_link, world_id, length, ele_gain, grade, climb_cat, type, createdAt, updatedAt)
        VALUES (${sprintId},
          ${segment_name},
          ${zi_link},
          ${world_id},
          ${length},
          ${ele_gain},
          ${avg_grade ? avg_grade : 0},
          'S',
          'sprint',
          NOW(),
          NOW());`

      await runQuery(sprintQuery)
      
    }
    res.status(200).send('Route added')
  // Do not seed the tables, seed in bulk due to API call restrictions
})

// PUT
// Edit data on the segment - ONLY can be edited on the STRAVA ID
router.put('/:id', async (req,res) => {
  const { id } = req.params
  const { segment_name, zi_link, world_id, length, ele_gain, type } = req.body

  //  Get data from the database
  const selectQuery = `SELECT * FROM public."Routes"
  WHERE strava_id = ${id}`

  const currData = runQuery(selectQuery)
  const dataMap = generateMap(currData[0])

  let newLength = length || dataMap.get('length')
  let newEle = ele_gain || dataMap.get('ele_gain')
  let newGrade = calcAvgGrade(newLength, newEle)
  let newCat = calcClimbCat(newLength, newEle)

  // update the segments table
  const updateQuery = `UPDATE public."Routes"
    SET segment_name = ${segment_name ? segment_name : dataMap.get('segment_name')},
      zi_link = ${zi_link ? zi_link : dataMap.get('zi_link')},
      world_id = ${world_id ? world_id : dataMap.get('world_id')},
      length = ${length ? length : dataMap.get('length')},
      ele_gain = ${ele_gain ? ele_gain : dataMap.get('ele_gain')},
      type = ${type ? type : dataMap('type')},
      grade = ${newGrade},
      climb_cat = ${newCat},
      updatedAt = NOW()
    WHERE strava_id = ${id};`

  await runQuery(updateQuery)
  res.status(200).send('Complete')

  
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
