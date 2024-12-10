const indexExpress = require("express")
const indexRouter = indexExpress.Router()
const todosRouterConnector = require("./todos")
const usersRouterConnector = require("./users")
const accountsRouterConnector = require("./accounts")

indexRouter.use("/accounts", accountsRouterConnector)
indexRouter.use("/users", usersRouterConnector)
indexRouter.use("/todos", todosRouterConnector)

module.exports = indexRouter
