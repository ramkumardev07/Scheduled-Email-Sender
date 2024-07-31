
const express = require('express')
const app = express()
const path = require('path')
app.use(express.urlencoded({extended:true}))
app.use(express.json());

app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'));

const route1 = require("./routes/Register.route")
const route2 = require("./routes/Schedule_email.route")
app.use(route1)
app.use(route2)


// port 
const port = 3000
app.listen(port,()=>{
    console.log("server is running at port"+" "+port)
})