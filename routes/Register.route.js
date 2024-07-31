const express = require('express')
const app = express()
const { errors } = require('celebrate')

const {SignUp,LogIn,jobrole} = require('../controllers/Registration.controller')
const validations = require('./validation.route')
app.use(errors())
app.post('/SignUp',validations,SignUp)
app.get('/LogIn',LogIn)
app.get('/job',jobrole)
module.exports = app