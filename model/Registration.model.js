
const { Timestamp } = require('mongodb')
const dbo = require('../database')
const uuid = require('uuid-mongodb')
const { pipeline } = require('nodemailer/lib/xoauth2')


exports.SignupUser = async (userdata) =>{

    const database = await dbo.getdatabase()
    const newUsers = database.collection('New_users')
    const Scheduled_mails = database.collection('Scheduled_mails')

    const check_user = await newUsers.findOne({ $or: [{ username: userdata.username }, { email: userdata.email }] })
    console.log(check_user)
    if(check_user == null){

        const user_uuid = uuid.v1()
        let detials = {
            _id:user_uuid.toString('N'),
            username:userdata.username,
            password:userdata.password,
            email:userdata.email,
            resgisteredAt:new Date(),
            timeAt: new Timestamp()
        }

        await newUsers.insertOne(detials)
        const registerd_user = await newUsers.findOne({username:userdata.username})
        await Scheduled_mails.insertOne({
            userId:registerd_user._id,
            Scheduled_mails:[]
        })
        return registerd_user
        
    }
    else{
        return null
    }

}

exports.Login_User = async(userdata) =>{

    const database = await dbo.getdatabase()
    const newUsers = database.collection('New_users')


    const exist_User = await newUsers.findOne({$and:[{username:userdata.username},{password:userdata.password}]})
    console.log(exist_User)
    if(exist_User == null){
        return "invalid username or password"
    }
    else{
        return exist_User
    }
}

exports.relevant_job = async (userdata) =>{

    const database = await dbo.getdatabase2()
    const user_detials = database.collection('user')
    const job_role2 = database.collection('jobrole2') 
    console.log(userdata.name)
    const relevant_job = user_detials.aggregate([
        {$match:{name:userdata.name}},
        {$lookup:{
            from:"jobrole2",
            let:{userskill:"$skills",user_exp:"$experience"},
            pipeline:[
                {
                $match:
                    {$expr:
                        {$and:
                            [
                                {$eq:["$experience","$$user_exp"]},
                                {$in:["$skill","$$userskill"]}
                            ]
                        }
                    }
                } 
            ],
            as:"relevantjob"
        }},
    ])

    const cursor = await relevant_job.toArray()
    return cursor
}