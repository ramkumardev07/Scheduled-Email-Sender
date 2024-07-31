const express = require('express')
const app = express()
const {ScheduleMail,paginations} = require('../controllers/Schedule.controller')
app.post('/SheduleMail',ScheduleMail)
app.get('/page/:page/:userId',paginations)
app.get('/')


module.exports = app
