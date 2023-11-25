const router = require('express').Router()
require('dotenv').config()

// dependencies
const runQuery = require('../functions/runQuery')       // Runs Querys
const generateMap = require('../functions/generateMap')

// GET
// GET all routes
router.get('/', async (req, res) => {
  const selectQuery = `SELECT A.strava_id,
      A.name,
      A.zi_link,
      A.world_id,
      A.world_route_id,
      A.route_id,
      A.length,
      A.elevation,
      A.restriction,
      B.type,
      B.count,
      B.pr_time,
      B.pr_date,
      B.silver_time,
      B.silver_date,
      B.bronze_time,
      B.bronze_date
    FROM public."Routes" A 
    LEFT JOIN public."Zwift_PRs" B
      ON A.strava_id = B.strava_id;`

  try {
    const routes = await runQuery(selectQuery)
    res.status.apply(200).send(routes)
  } catch (error) {
    res.status(500).send(error)
  }
})

// GET route my id
router.get('/:id', async (req, res) => {
  const { id } = req.params
  const selectQuery = `SELECT A.strava_id,
      A.name,
      A.zi_link,
      A.world_id,
      A.world_route_id,
      A.route_id,
      A.length,
      A.elevation,
      A.restriction,
      B.type,
      B.count,
      B.pr_time,
      B.pr_date,
      B.silver_time,
      B.silver_date,
      B.bronze_time,
      B.bronze_date
    FROM public."Routes" A 
    LEFT JOIN public."Zwift_PRs" B
    ON A.strava_id = B.strava_id
    WHERE A.strava_id = ${Number(id) ? id : null}
      OR A.zi_link = '${id.toLowerCase()}';`

  try {
    const route = await runQuery(selectQuery)
    res.status(200).send(route)
  } catch (error) {
    res.status(500).send(error)
  }
})

// POST
// POST A NEW ROUTE
router.post('/', async (req,res) => {
  // Validate the required data is present
  const { strava_id, name, zi_link, world_id, length, elevation, world_route_id, route_id, restriction } = req.body
  if (!strava_id || !name, !zi_link, !world_id, !length, !elevation) res.status(400).send('Invalid request - Required fields not entered')
  // POST to ROUTES TABLE
  const routesQuery =`INSERT INTO public."Routes" (strava_id, name, zi_link, world_id, length, elevation, world_route_id, route_id, restriction, createdAt, updatedAt)
    VALUES (${strava_id},
      ${name},
      ${zi_link},
      ${world_id},
      ${length},
      ${elevation},
      ${world_route_id ? world_route_id : null},
      ${route_id ? route_id : null},
      ${restriction ? restriction : null},
      NOW(),
      NOW());`
  await runQuery(routesQuery)
      
  // POST to ZWIFT_PR TABLE
  const prQuery = `INSERT INTO public."Zwift_PRS" (strava_id, type, createdAt, updatedAt)
    VALUES (${strava_id},
      'route',
      NOW(),
      NOW());`
  await runQuery(prQuery)

  res.status(200).send('Route added')
  // Do not seed the tables, seed in bulk due to API call restrictions
})

// PUT
// Edit data on the route - ONLY can be edited on the STRAVA ID
router.put('/:id', async (req,res) => {
  const { id } = req.params
  const { name, zi_link, world_id, length, elevation, restriction } = req.body

  //  Get data from the database
  const selectQuery = `SELECT * FROM public."Routes"
    WHERE strava_id = ${id}`

  const currData = runQuery(selectQuery)
  const dataMap = generateMap(currData)

  // update the routes table
  const updateQuery = `UPDATE public."Routes"
    SET name = ${name ? name : dataMap.get('name')},
      zi_link = ${zi_link ? zi_link : dataMap.get('zi_link')},
      world_id = ${world_id ? world_id : dataMap.get('world_id')},
      length = ${length ? length : dataMap.get('length')},
      elevation = ${elevation ? elevation : dataMap.get('elvation')},
      restriction = ${restriction ? restriction : dataMap('retriction')}
    WHERE strava_id = ${id};`

  await runQuery(updateQuery)

  res.status(200).send('Complete')
})

// Edit strava id on the route - ONLY can be edited on the STRAVA ID - CASCADE to PR tables
router.put('/strava/:id', async (req,res) => {
  const { id } = req.params
  const { strava_id } = req.body

  // Validate the Strava id - needs to be updated 
  if (!strava_id) res.status(400).send('No Strava Id sent')
  else if (strava_id === id) res.status(400).send('Strava Id matched current Id')
  else {
    // Update the Routes Table
    const routesQuery = `UPDATE public."Routes"
      SET strava_id = ${strava_id},
      updatedAt = NOW()
      WHERE strava_id = ${id};`
    await runQuery(routesQuery)

    // Update the Zwift_PRs Table - remove effort data
    const prQuery = `UPDATE public."Routes"
      SET strava_id = ${strava_id},
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
    await runQuery(deleteYearlyQuery)
    // Do not seed the tables, seed in bulk due to API call restrictions
  }
  res.status(200).send('Complete')
})

// DELETE
// DELETE a route 
router.delete('/:id', async (req, res) => {
  const { id } = req.params
  // remove route from Routes Table
  const deleteRoutesQuery = `DELETE FROM public."Routes" 
    WHERE strava_id = ${id};`
  await runQuery(deleteRoutesQuery)
  
  // remove route from Zwift_PR Table
  const deletePRQuery = `DELETE FROM public."Zwift_PRs" 
    WHERE strava_id = ${id};`
  await runQuery(deletePRQuery)

  // remove route from Zwift_PR Table
  const deleteYearlyQuery = `DELETE FROM public."Yearly_PRs" 
    WHERE strava_id = ${id};`
  await runQuery(deleteYearlyQuery)
})

module.exports = router
