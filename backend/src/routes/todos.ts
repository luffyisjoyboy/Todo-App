const todosExpress = require('express')
const todosRouter = todosExpress.Router()
const todosZod = require("zod")
const todosAuthmiddleware = require('../middleware')
const todosPrisma = require("../db_connection")

const todoSchema = todosZod.object({
    title: todosZod.string(),
    description: todosZod.string(),
})

todosRouter.post("/create", todosAuthmiddleware, async(req:any, resp:any)=>{
    const {success} = todoSchema.safeParse(req.body)
    if (!success){
        return resp.json({
            msg: "Invalid data"
        })
    }
    await todosPrisma.$connect()
    try{
        let todo = await todosPrisma.todo.create({
            data:{
                ...req.body,
                user_id: req.id,
            },
        })

        return resp.status(200).json({
            msg:"Todo created",
            todo,
        })
    } catch(err){
        return resp.json({
            msg: "Todo creation failed",
            err
        })
    } finally{
        await todosPrisma.$disconnect()
    }
})

todosRouter.get("/todos", todosAuthmiddleware, async(req:any, resp:any)=>{
    await todosPrisma.$connect()
    try{
        let todos = await todosPrisma.todo.findMany({
            where: {
                user_id: req.id
            },
            select:{
                title:true,
                description:true,
                status: true,
                created: true
            },
            take:10
        })
        return resp.json({
            todos
        })
    } catch(err){
        return resp.json({
            msg: "Todo fetching failed"
        })
    } finally{
        await todosPrisma.$disconnect()
    }
})

module.exports = todosRouter