const routes = require('express').Router()
const userController = require('../controllers/UserController')
const sessionController = require('../controllers/SessionController')

routes.get('/users', userController.index)
routes.post('/users', userController.create)
routes.get('/users/:id', userController.get)
routes.delete('/users/:id', userController.delete)
routes.put('/users/:id', userController.update)
routes.post('/users/reset', userController.resetPassword)
routes.post('/users/forgot', userController.forgotPassword)

routes.post('/login', sessionController.login)
routes.post('/login/google/acc', sessionController.loginWithGoogleAcc)


module.exports = routes