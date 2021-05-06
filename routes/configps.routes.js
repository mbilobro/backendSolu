const routes = require('express').Router()
const configController = require('../controllers/ConfigPSController')

routes.get('/config', configController.index)
routes.post('/config/:value', configController.change)

module.exports = routes