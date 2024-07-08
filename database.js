const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient
let database
var url = "mongodb://127.0.0.1:27017";
async function getdatabase(){
  const client = await MongoClient.connect(url)
  database = client.db("Email_sender")
  if(!database){
    console.log("database not connected")
  }
  else{
    return database
  }

}

module.exports = {getdatabase}