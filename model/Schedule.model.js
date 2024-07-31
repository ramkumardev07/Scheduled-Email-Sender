const { Timestamp } = require('mongodb')
const dbo = require('../database')
const uuid = require('uuid-mongodb')


exports.scheduleMail_data = async(userdata,imageurl) =>{
    const database = await dbo.getdatabase()
    const newUsers = database.collection('New_users')
    const Scheduled_mails = database.collection('Scheduled_mails')

    const checkUser = await newUsers.findOne({email:userdata.fromEmail})
    if(checkUser == null){
        return null
    }
    else{
        const Mailhistory = await Scheduled_mails.updateOne({userId:checkUser._id},{$addToSet:{
            "scheduled_mails":{
                to_emailId : userdata.toEmailId,
                date:userdata.date,
                Time:userdata.time,
                subject: userdata.subject,
                attacgments: userdata.attachments,
                message_content: userdata.content,
                imgsrc: imageurl
            }
        }})
        return checkUser
    }
}

exports.historyMails = async (userdata) =>{

    const database = await dbo.getdatabase()
    const newUsers = database.collection('New_users')
    const Scheduled_mails = database.collection('Scheduled_mails')
    const page = userdata.page
    const limit = 3
    const offset = (page - 1)*limit
    // console.log(offset)
    // const linkedData = newUsers.aggregate([{ 
    //     $match:{
    //         userId: userdata.userId
    //     }},{
    //     $lookup: { 
    //         from: "Scheduled_mails", 
    //         localField: "_id", 
    //         foreignField: "userId", 
    //         as: "MailHistory" 
    //     }
    //   },
    //   {
    //     $project:{
    //         _id:0,
    //         username: 0,
    //         password:0,
    //         email: 0,
    //         resgisteredAt:0,
    //         timeAt: 0,
    //     }
    //   },
     
    // ])
    // const cursor = await linkedData.toArray()    .limit(limit).skip(offset).toArray()
    // const userhistory = cursor[0].MailHistory[0].Scheduled_mails
    // console.log(JSON.stringify(cursor[0].Mailhistory,null,2))
    const cursor = Scheduled_mails.aggregate([ 
        { $match: { userId:userdata.userId } }, 
        { $project: { _id: 0, userId: 0 } }, 
        { $unwind: '$scheduled_mails' },
        {$skip:offset},
        {$limit:limit},
        ] )
    const userhistory = await cursor.toArray()
    // console.log(userhistory)

    if(userhistory.length != 0){
        return userhistory
    }
    else{
        return null
    }

}