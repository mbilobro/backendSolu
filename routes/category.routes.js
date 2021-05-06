const routes = require('express').Router()
const categoryController = require('../controllers/CategoryController')
const ensureUserAuthMiddleware = require("../middleware/ensureUserAuth")

routes.get('/categories', ensureUserAuthMiddleware, categoryController.index)
routes.post('/categories', ensureUserAuthMiddleware, categoryController.create)

module.exports = routes