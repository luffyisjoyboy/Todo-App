import { title } from "node:process"
import { todo } from "node:test"

const usersExpress = require('express')
const usersRouter = usersExpress.Router()
const usersAuthmiddleware = require('../middleware')
const usersPrisma = require("../db_connection")

usersRouter.get("/todos", usersAuthmiddleware, async (req:any, resp:any)=>{
    await usersPrisma.$connect()
    try{
        let user_todos = await usersPrisma.user.findMany({
            where: {
                id: req.id
            },
            select: {
                id: true,
                Todos: {
                    select: {
                        title:true,
                        description: true,
                        status: true
                    }
                }
            },
        })
        return resp.json({
            user_todos
        })
    }catch(err){
        resp.json({
        msg:"No Todos to fetch",
        err
    })
    } finally{
        await usersPrisma.$disconnect()
    }

})

module.exports = usersRouter