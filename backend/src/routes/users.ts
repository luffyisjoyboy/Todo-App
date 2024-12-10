const usersExpress = require('express')
const usersRouter = usersExpress.Router()

usersRouter.get("/home", (req:any, resp:any)=>{
    resp.json({
        msg:"Test 1234"
    })
})

module.exports = usersRouter