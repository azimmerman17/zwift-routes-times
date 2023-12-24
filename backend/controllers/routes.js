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
      B.last_effort_time,
      B.last_effort_date,
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
    if (routes.error) res.status(500).send({routes, table: 'Routes'})
    else res.status(200).send(routes)
  } catch (error) {
    res.status(500).send(error)
  }
})

// GET route by id
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
    B.last_effort_time,
    B.last_effort_date,
    B.pr_time,
    B.pr_date,
    B.silver_time,
    B.silver_date,
    B.bronze_time,
    B.bronze_date
    FROM public."Routes" A
    LEFT JOIN public."Zwift_PRs" B
    ON A.strava_id = B.strava_id
    WHERE (A.strava_id = ${Number(id) ? id : null}
    OR A.zi_link = '${id.toLowerCase()}')
    ;`
    
    try {
      const route = await runQuery(selectQuery)
      
      if (route === null) res.status(404).send('Invaild Route')
      else if (route.error) res.status(500).send({route, table: 'Routes'})
    else {
      const { strava_id } = route[0]
      
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
          route,
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
router.post('/', async (req,res) => {
  // Validate the required data is present
  const { strava_id, name, zi_link, world_id, length, elevation, world_route_id, route_id, restriction } = req.body
  if (!strava_id || !name, !zi_link, !world_id, !length, !elevation) res.status(400).send('Invalid request - Required fields not entered')
  else {
    // POST to ROUTES TABLE
    const routesQuery =`INSERT INTO public."Routes" (strava_id, name, zi_link, world_id, length, elevation, world_route_id, route_id, restriction, created_at, updated_at)
      VALUES (${strava_id},
        '${name}',
        '${zi_link}',
        ${world_id},
        ${Number(length).toFixed(2)},
        ${Math.floor(elevation)},
        ${world_route_id ? world_route_id : null},
        ${route_id ? route_id : null},
        ${restriction ? `'${restriction}'` : null},
        NOW(),
        NOW());`
    let result = await runQuery(routesQuery)
    if (result.error) res.status(500).send({result, table: 'Routes'})
    else {
    // POST to ZWIFT_PR TABLE
    const prQuery = `INSERT INTO public."Zwift_PRs" (strava_id, type, created_at, updated_at)
    VALUES (${strava_id},
      'route',
      NOW(),
      NOW());`
      result = await runQuery(prQuery)
      
      if (result.error) res.status(500).send({result, table: 'Zwift_PRs'})
      else res.status(200).send('Route added')
    }
  // Do not seed the tables, seed in bulk due to API call restrictions
  }
})

// PUT
// Edit data on the route - ONLY can be edited on the STRAVA ID
router.put('/:id', async (req,res) => {
  const { id } = req.params
  const { name, zi_link, world_id, length, elevation, restriction } = req.body

  //  Build the update query
  let updateQuery = `UPDATE public."Routes"
    SET updated_at = NOW()`
    
  if (name !== undefined ) {
    updateQuery = `${updateQuery},
      name = '${name}'`
  }
  if (zi_link !== undefined) {
    updateQuery = `${updateQuery},
    zi_link = '${zi_link}'`
  }
  if (world_id !== undefined) {
    updateQuery = `${updateQuery},
    world_id = ${world_id}`
  }
  if (length !== undefined) {
    updateQuery = `${updateQuery},
    length = ${Number(length).toFixed(2)}`
  }
  if (elevation !== undefined) {
    updateQuery = `${updateQuery},
    elevation = ${Math.floor(elevation)}`
  }
  if (restriction !== undefined) {
    updateQuery = `${updateQuery},
    restriction = ${restriction}`
  }
    
  // Add WHERE clause
  updateQuery = `${updateQuery}
  WHERE strava_id = ${id};`
  
  let result = await runQuery(updateQuery)
  if (result.error) res.status(500).send({currData, table: 'Routes'})
  else res.status(200).send('Complete')
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
      updated_at = NOW()
      WHERE strava_id = ${id};`
    let result = await runQuery(routesQuery)
    if (result) res.status(500).send({result, table: 'Routes - 189'})
    else {
      // Update the Zwift_PRs Table - remove effort data
      const prQuery = `UPDATE public."Zwift_PRs"
        SET strava_id = ${strava_id},
          count = null,
          last_effort_time = null,
          last_effort_date = null,
          pr_time = null,
          pr_date = null,
          pr_effort_id = null,
          silver_time = null,
          silver_date = null,
          silver_effort_id = null,
          bronze_time = null,
          bronze_date = null,
          bronze_effort_id = null,
          updated_at = NOW()
        WHERE strava_id = ${id};`
      let result = await runQuery(prQuery)
      console.log(result)
      if (result) res.status(500).send({result, table: 'Zwift_PRs'})
      else {
        // Remove all instances from the Yearly_PR table
        const deleteYearlyQuery = `DELETE FROM public."Yearly_PRs" 
          WHERE strava_id = ${id};`
        let result = await runQuery(deleteYearlyQuery)
        if (result) res.status(500).send({result, table: 'Yearly_PRs'})
        else res.status(200).send('Complete')
        // Do not seed the tables, seed in bulk due to API call restrictions
      }
    }
  }
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

  res.status(200).send('Complete')
})

module.exports = router
