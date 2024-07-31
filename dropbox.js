const dropbox = require('dropbox').Dropbox
const fs = require('fs')
const path = require('path')
const { response } = require('./routes/Register.route')
const dbx = new dropbox({
    accessToken:"l.B5FA6Ro2lGuXJAr_Ssf3HYod7wJrJUZ5cN42mWJwJ2G9U5fkzy9QU9dVVmYzjRmfB86hcWWC4_4pj7CkS8XWNKfmZwnBRwNUWJotpBON43Lvt0iRAblTL_zyJ3_D3wFXnD8ixddjYh5Mm2w"
    })
const imageurl = async (dropboxFilepath) =>{
    const response = await dbx.filesGetTemporaryLink({path: dropboxFilepath})
    const fileUrl = response.result.link
}