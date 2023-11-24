require('dotenv').config()
const express = require('express')
const cors = require('cors')
const pg = require('pg')

const app = express();

//middleware
app.use(cors())
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))

// controllers
const processController = require('./controllers/processses')


app.use('/process', processController)

//Listening on Port
app.listen(process.env.PORT, () => {
  console.log(`Listening on ${process.env.PORT}`)
})