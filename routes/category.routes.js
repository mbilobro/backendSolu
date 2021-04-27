const routes = require('express').Router()
const categoryController = require('../controllers/CategoryController')

routes.get('/categories', categoryController.index)
routes.post('/categories', categoryController.create)

module.exports = routes