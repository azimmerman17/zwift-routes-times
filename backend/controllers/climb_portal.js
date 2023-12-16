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
      A.rw_strava_id,
      A.zi_link,
      A.climb_name,
      A.country,
      A.length,
      A.elevation,
      A.avg_grade,
      A.climb_cat,
      B.count,
      B.last_effort_time,
      B.last_effort_date,
      B.pr_time,
      B.pr_date,
      B.silver_time,
      B.silver_date,
      B.bronze_time,
      B.bronze_date,
      A.fr_strava_id,
      C.count as fr_count,
      C.last_effort_time as fr_last_effort_time,
      C.last_effort_date as fr_last_effort_date,
      C.pr_time as fr_pr_time,
      C.pr_date as fr_pr_date,
      C.silver_time as fr_silver_time,
      C.silver_date as fr_silver_date,
      C.bronze_time as fr_bronze_time,
      C.bronze_date as fr_bronze_date 
    FROM public."Climb_Portal" A 
    LEFT JOIN public."Zwift_PRs" B
      ON A.strava_id = B.strava_id
    LEFT JOIN public."Zwift_PRs" C
      ON A.fr_strava_id = C.strava_id`

  try {
    const segments = await runQuery(selectQuery)
    res.status(200).send(segments)
  } catch (error) {
    res.status(500).send(error)
  }
})

// GET route by id
router.get('/:id', async (req, res) => {
  const { id } = req.params
  const selectQuery = `SELECT A.strava_id,
      A.rw_strava_id,
      A.zi_link,
      A.climb_name,
      A.country,
      A.length,
      A.elevation,
      A.avg_grade,
      A.climb_cat,
      B.count,
      B.last_effort_time,
      B.last_effort_date,
      B.pr_time,
      B.pr_date,
      B.silver_time,
      B.silver_date,
      B.bronze_time,
      B.bronze_date,
      A.fr_strava_id,
      C.count as fr_count,
      C.last_effort_time as fr_last_effort_time,
      C.last_effort_date as fr_last_effort_date,
      C.pr_time as fr_pr_time,
      C.pr_date as fr_pr_date,
      C.silver_time as fr_silver_time,
      C.silver_date as fr_silver_date,
      C.bronze_time as fr_bronze_time,
      C.bronze_date as fr_bronze_date 
    FROM public."Climb_Portal" A 
    LEFT JOIN public."Zwift_PRs" B
      ON A.strava_id = B.strava_id
    LEFT JOIN public."Zwift_PRs" C
      ON A.fr_strava_id = C.strava_id
    WHERE A.strava_id = ${Number(id) ? id : null}
      OR A.zi_link = '${Number(id) ?  null : id.toLowerCase()}'
      OR A.fr_strava_id = ${Number(id) ? id : null};`

    try {
    
      const portal = await runQuery(selectQuery)
      // generate a map to get segment ids for both worlds
      const stravaMap = generateMap(portal[0])

      // set the strava_ids
      const watopiaId = stravaMap.get('strava_id')
      const franceId = stravaMap.get('fr_strava_id')

      const selectYearQuery = `SELECT A.strava_id,
          A.year,
          A.pr_time as yr_pr_time,
          A.pr_date as yr_pr_date
        FROM public."Yearly_PRs" A
        WHERE A.strava_id = ${watopiaId}
          OR A.strava_id = ${franceId};`

      console.log(selectYearQuery)

      const year = await runQuery(selectYearQuery)

      res.status(200).send({
        portal,
        year
      })
    } catch (error) {
      res.status(500).send(error)
    }
    })

// POST
// POST A NEW ROUTE
router.post('/', async (req,res) => {
  const { strava_id, fr_strava_id, rw_strava_id, climb_name, zi_link, country, length, elevation } = req.body
  // Validate the required data is present
  if (!strava_id, !fr_strava_id, !rw_strava_id, !zi_link, !length, !elevation) res.status(400).send('Invalid request - Required fields not entered')

  
  const portalQuery = `INSERT INTO public."Segments (strava_id, fr_strava_id, rw_strava_id, zi_link, climb_name, country, length, elevation, avg_grade, climb_cat, createdAt, updatedAt)
    VALUES (${strava_id},
      ${fr_strava_id},
      ${rw_strava_id},
      ${zi_link},
      ${climb_name},
      ${country},
      ${length},
      ${elevation},
      ${calcAvgGrade(length, elevation)},
      ${calcClimbCat(length,elevation)},
      NOW(),
      NOW());`

  await runQuery(komQuery)
  res.status(200).send('Climb Portal Segment added')
})

// PUT
// Edit data on the route - ONLY can be edited on the STRAVA ID
router.put('/:id', async (req,res) => {
  const { id } = req.params
  const { rw_strava_id, climb_name, zi_link, country, length, elevation } = req.body

  //  Get data from the database
  const selectQuery = `SELECT * FROM public."Routes"
    WHERE strava_id = ${id}`
  
  const currData = runQuery(selectQuery)
  const dataMap = generateMap(currData[0])

  let newLength = length || dataMap.get('length')
  let newEle = elevation || dataMap.get('elevation')
  let newGrade = calcAvgGrade(newLength, newEle)
  let newCat = calcClimbCat(newLength, newEle)

    // update the segments table
    const updateQuery = `UPDATE public."Routes"
      SET climb_name = ${climb_name ? climb_name : dataMap.get('climb_name')},
        rw_strava_id = ${rw_strava_id ? rw_strava_id : dataMap.get('rw_strava_id')},
        zi_link = ${zi_link ? zi_link : dataMap.get('zi_link')},
        world_id = ${country ? country : dataMap.get('country')},
        length = ${length ? length : dataMap.get('length')},
        ele_gain = ${elevation ? elevation : dataMap.get('elevation')},
        grade = ${newGrade},
        climb_cat = ${newCat},
        updatedAt = NOW()
      WHERE strava_id = ${id};`

  await runQuery(updateQuery)
  res.status(200).send('Complete')  
})

// Edit strava id or fr strava id on the route - ONLY can be edited on the STRAVA ID - CASCADE to PR tables
router.put('/strava/:id', async (req,res) => {
  const { id } = req.params
  const { update_id, world } = req.body

  // Get the current strava_ids for the portal segment
  const idQuery = `SELECT strava_id, fr_strava_id FROM public."Climb_Portal"
    WHERE strava_id = ${id};`
  const currentIds = await runQuery(idQuery)
  const idMap = generateMap(currentIds[0])

  // set current the strava_id
  let currentId 
  if (!world) res.status(400).send('Not able to validate the world for update.')
  if (world === 'Watopia') currentId = idMap.get('strava_id')
  else  currentId = idMap.get('fr_strava_id')

  // Validate the Strava id - needs to be updated 
  if (!update_id) res.status(400).send('No Strava Id sent')
  else if (update_id === currentId) res.status(400).send('Strava Id matched current Id')
  else {
    const updateQuery = `UPDATE public."Climb_Portal"
      SET ${world === 'Watopia' ? 'strava_id' : 'fr_strava_id'} = ${currentId},
        updatedAt = NOW()
      WHERE strava_id = ${id};`
    await runQuery(updateQuery)

    // Update the Zwift_PRs Table - remove effort data
    const prQuery = `UPDATE public."Zwift_PRs"
      SET strava_id = ${update_id},
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
      WHERE strava_id = ${update_id};`
    await runQuery(prQuery)

    // Remove all instances from the Yearly_PR table
    const yearQuery = `DELETE FROM public."Yearly_PRs" 
      WHERE strava_id = ${update_id};`
    await runQuery(yearQuery)
    // Do not seed the tables, seed in bulk due to API call restrictions
  }
  res.status(200).send('Complete')
})

// DELETE
// DELETE a route 
router.delete('/:id', async (req, res) => {
  const { id } = req.params
  // remove segment from Climb_Portal Table  -- only pass in the strava_id not fr_strava_id or rw_strava_id
  const deleteRoutesQuery = `DELETE FROM public."Climb_Portal" 
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
})

module.exports = router