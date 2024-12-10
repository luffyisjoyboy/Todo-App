// // commonJs
const appExpress = require("express")
const indexRouterPath = require("./routes/index")
const app = appExpress()

app.use(appExpress.json())
app.use("/app/v1", indexRouterPath)

app.listen(3000,()=>{
    console.log("App is live on port 3000")
})

module.exports = app

