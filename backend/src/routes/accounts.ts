const accountsExpress = require('express')
const accountsZod = require("zod")
const accountsRouter = accountsExpress.Router()
const accountsJsonwebtoken = require("jsonwebtoken")
const accountPrisma = require("../db_connection")
const bcrypt = require("bcrypt")


const signupSchema = accountsZod.object({
    firstName: accountsZod.string(),
    lastName: accountsZod.string(),
    email: accountsZod.string().email(),
    password: accountsZod.string(),
})

const singinSchema = accountsZod.object({
    username: accountsZod.string(),
    password: accountsZod.string()
})


accountsRouter.post("/signup", async (req:any, resp:any)=>{
    const {success} = signupSchema.safeParse(req.body)
    if(!success){
        return resp.status(400).json({
            msg: "invalid data, please check input data"
        })
    }
    await accountPrisma.$connect()
    const hashed_pwd = await bcrypt.hash(req.body.password, 10)
    const result = await accountPrisma.user.create({
        data: {
            ...req.body,
            password: hashed_pwd
        },
        select : {id: true}
    })

    const token = accountsJsonwebtoken.sign(result, process.env.JWT_SECRET_KEY)
    await accountPrisma.$disconnect()
    return resp.json({
        token:token,
        user_id: result.id
    })

})

accountsRouter.post("/signin", async (req:any, resp:any)=>{
    const {success} = singinSchema.safeParse(req.body)
    if(!success){
        return resp.status(401).json({
            msg:"Invalid credentials"
        })
    }
    await accountPrisma.$connect()
    try{
        let data = await accountPrisma.user.findUnique({
        where:{
            email: req.body.username,
        },
        select: {
            id:true,
            password:true
        }
    })
    if(!data || !(await bcrypt.compare(req.body.password, data.password))){
        return resp.status(401).json({
            msg:"Invalid credentials"
        })
    }
    const token: string = accountsJsonwebtoken.sign(data, process.env.JWT_SECRET_KEY)
    
    return resp.status(200).json({
        token:token,
        msg: "User logged in successfully"
    })
    } catch(err){
         return resp.status(401).json({
            msg:"Invalid credentials"
        })
    } finally {
        await accountPrisma.$disconnect()
    }
} )


module.exports = accountsRouter