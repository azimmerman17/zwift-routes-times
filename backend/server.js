require('dotenv').config()
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const app = express();

//middleware
app.use(cors())
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(bodyParser.json())

// controllers
const processController = require('./controllers/processses')
const routesController = require('./controllers/routes')
const portalController = require('./controllers/climb_portal')
const segmentsController = require('./controllers/segments')

app.use('/process', processController)
app.use('/routes', routesController)
app.use('/climb', portalController)
app.use('/segments', segmentsController)


//Listening on Port
app.listen(process.env.PORT, () => {
  console.log(`Listening on ${process.env.PORT}`)
})