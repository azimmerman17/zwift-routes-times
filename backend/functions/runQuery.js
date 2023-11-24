require('dotenv').config()
const { Client } = require('pg')

async function runQuery(queryString) {
  const client = new Client(
    process.env.ELEPHANT_SQL_URI
  )
  
  try {
    // connect to Postgres DB
    await client.connect()
    let time = await client.query('SELECT NOW()')
    const { now } = time.rows[0]
    console.log('DB Connected:', now)

    // Run passed in Query
    let data = await client.query(queryString)
    // Close the Connection
    client.end() 

    const { rowCount, rows } = data
    if (rowCount > 0) {
      // if there is data return the rows
      return rows
    } else {
      // if there is no data return null
      return null
    }
  } catch (error) {
    console.error(error)
    // close the connection
    client.end() 
    // return the error
    return {
      msg: 'db connection error',
      error
    }
  }
}

module.exports = runQuery