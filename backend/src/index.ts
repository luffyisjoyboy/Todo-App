// // commonJs
const appExpress = require("express")
const appRouter = appExpress.Router()
const app = appExpress()

appRouter.route("app/v1", )

app.listen(3000,()=>{
    console.log("App is live on port 3000")
})

module.exports = app

