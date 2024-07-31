const dropbox = require('dropbox').Dropbox
const fs = require('fs')
const path = require('path')
const { response } = require('./routes/Register.route')
const dbx = new dropbox({
    accessToken:"drop box access token"
    })
const imageurl = async (dropboxFilepath) =>{
    const response = await dbx.filesGetTemporaryLink({path: dropboxFilepath})
    const fileUrl = response.result.link
}
