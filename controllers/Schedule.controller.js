const model = require('../model/Schedule.model')
const nodemailer = require('nodemailer')
const sndMail = require('@sendgrid/mail')
const schedule = require('node-schedule')
const fs = require('fs')
const path = require('path')
const pug = require('pug')
const juice = require('juice')
const express = require('express');
const multer = require('multer');
const { response } = require('../routes/Register.route')
const dropbox = require('dropbox').Dropbox
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

exports.ScheduleMail = async(req,res,next) =>{

    try{

        const location = multer.diskStorage({           
            destination : function(req,file,cb){
                cb(null,'attachmentFiles')

            },
            filename : function(req,file,cb){           
                cb(null,file.originalname)
            }
        })

        let upload = multer({storage : location}).single("file")

        upload(req,res,async function(err)
        {
            const fileName = req.file.originalname
            const data = JSON.parse(req.body.data);

            // drop box app access token
            const dbx = new dropbox({
                accessToken: process.env.DB_ACCESS_TOKEN
                })
            // drop box folder path
            const droppath = `/Email-Sender-attachments/${fileName}`;
            // get the uploaded file content
            const filecontent = fs.readFileSync(path.join(__dirname,'../attachmentFiles',fileName))
    
            const response = dbx.filesUpload({
                path:droppath,
                contents:filecontent,
                mode:{".tag":"overwrite"}
            })
            .then(response=>{
                    return response
             })
            .catch(err =>{
                    console.log(err)
            })

            //use the return data to get the image url
            const fileinfo = await response
            //function to get image url
            const imageurl = async (dropboxFilepath) =>{
                const response = await dbx.filesGetTemporaryLink({path: dropboxFilepath})
                const fileUrl = response.result.link
                return fileUrl
            }
            const imageUrl = await imageurl(fileinfo.result.path_display)
            const scheduled_mail = await model.scheduleMail_data(data,imageUrl)

        if(scheduled_mail != null){

            const subject = data.subject
            const mail_content = data.content
            const html = pug.renderFile(path.join(__dirname,'../views','scheduleMail.body.pug'),{subject:subject,content:mail_content})
            const inLined_html = juice(html)
            const transporter = nodemailer.createTransport({
                service:'gmail',
                auth:{
                // user:req.body.fromemail,
                // pass:req.body.appPass
                user: process.env.MAIL_ID,
                pass: process.env.MAIL_PASSWORD,
            }
            })
            const mailcontent = {
                from:process.env.MAIL_ID,
                // from:req.body.fromemail,
                to:data.toEmailId,
                subject:data.subject,
                html:inLined_html,
                 attachments: [
                    {
                        filename: fileName,
                        path: path.join(__dirname,'../attachmentFiles',fileName),
                    }
                ]

                }
    
            const dateString = data.date
            const timeString = data.time

            const date = (dateString, timeString) =>{
                const [year, month, day] = dateString.split('/').map(Number);
                const [hours, minutes, seconds] = timeString.split(':').map(Number);
                return new Date(year, month - 1, day, hours, minutes, seconds);
            }

            const Schedule_date = date(dateString,timeString)
            // const dates = new Date(2024, 6, 6, 18,8, 0);
            const scheduledMail = schedule.scheduleJob(Schedule_date, () => {
                transporter.sendMail(mailcontent, (err, data) => {
                    if (err) {
                        fs.unlink(path.join(__dirname,'../attachmentFiles',fileName), (err) => {
                            if (err) throw err;
                            console.log('file was deleted from local');
                          });
                        console.log(err)
                    } else {
                        fs.unlink(path.join(__dirname,'../attachmentFiles',fileName), (err) => {
                            if (err) throw err;
                            console.log('file was deleted from local');
                          });
                        console.log(err)
                        console.log("email send")
                    }
                })
       
            })
            
            res.status(200).send({
                message:"email scheduled successful !"
            })
        }
        else{
          
            res.status(400).send({
                message:"entered Mail is not registered"
        })
    }
})}
    catch(err){
        res.status(400).send({
            message:err.message
        })
    }   
}


exports.paginations = async(req,res,next) =>{
    try{
        // console.log(req.params)
        const pagination = await model.historyMails(req.params)
        if(pagination != null){
            res.status(200).send({
                pagination
            })
        }
        else{
            res.status(400).send({
                message : "no more coversatation"
            })
        }

    }
    catch(err){
        res.status(400).send({
            historyMails: err.message
        })
    }
}