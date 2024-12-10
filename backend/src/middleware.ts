const middlewareJsonwebtoken = require("jsonwebtoken")

const authMiddleware : any = (req:any, resp:any, next:any)=>{
    const headers = req.headers
    const token = headers.split(" ")[1]
    try{
        let data = middlewareJsonwebtoken.verify(token, process.env.JWT_SECRET_KEY)
        req["id"] = data.id
        next()
    } catch(err){
        return resp.status(411).json({
            msg: "Invalid crednetials"
        })
    }
}
module.exports = authMiddleware