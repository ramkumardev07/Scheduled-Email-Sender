const model = require('../model/Registration.model')
const nodemailer = require('nodemailer')
const sndMail = require('@sendgrid/mail')
const dotenv = require("dotenv")
dotenv.config();
const pug = require('pug')
const path = require('path')
const juice = require('juice')


exports.SignUp = async (req, res, next) => {

    try {
        const newUser = await model.SignupUser(req.body);
        
        if(newUser != null){
            const query_email = 'queries@emailfinder@gmail.com'
            const html = pug.renderFile(path.join(__dirname,'../views','welcomeMail.body.pug'),{email:query_email})
            const inLined_html = juice(html)
            const transpoter = nodemailer.createTransport({
                service:"gmail",
                auth:{
                user: process.env.MAIL_ID,
                pass: process.env.MAIL_PASSWORD,
                }
            })

            const mailcontent = {
                from:process.env.MAIL_ID,
                to:newUser.email,
                subject:"Welcome to Email-sender",
                html:inLined_html,
               
            }

            transpoter.sendMail(mailcontent,(err,data)=>{
                if(err){
                    res.status(400).send({
                    message:err.message
                   }) 
                }
                else{
                res.status(200).send({ 
                    message:data
                })
                }    
            })   
        }
        else{
            res.status(400).send({
                message:"username & email is already exists"
            })
        }  
    } 
    catch (err) {
        res.status(400).send({
            message: err.message
        });
    }
}

exports.LogIn = async (req,res,next) =>{
    console.log("hi")
    try{
    console.log(req.body)
    const exist_user =  await model.Login_User(req.body)
    res.status(200).send({
        message:"Hi"+" "+exist_user.username+" "+"you LogIn successfully !",
    })
    }
    catch(err){
        res.status(400).send({
            message:err.message
        })
    }
}


exports.jobrole = async(req,res,next) =>{
    try{
        const relevantrole = await model.relevant_job(req.body)
        res.status(200).send({
            message: relevantrole
        })

    }
    catch(err){
        res.status(400).send({
            message: err.message
        })
    }
}