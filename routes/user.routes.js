const routes = require('express').Router()
const userController = require('../controllers/UserController')
const sessionController = require('../controllers/SessionController')
const ensureUserAuthMiddleware = require("../middleware/ensureUserAuth")

routes.get('/users', ensureUserAuthMiddleware, userController.index)
routes.post('/users', userController.create)
routes.get('/users/:id', userController.get)
routes.delete('/users/:id', ensureUserAuthMiddleware, userController.delete)
routes.put('/users/:id', ensureUserAuthMiddleware, userController.update)
routes.post('/users/reset', userController.resetPassword)
routes.post('/users/forgot', userController.forgotPassword)

routes.post('/login', sessionController.login)
routes.post('/login/google/acc', sessionController.loginWithGoogleAcc)


module.exports = routes