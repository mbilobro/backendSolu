const routes = require('express').Router()
const configController = require('../controllers/ConfigPSController')
const ensureUserAuthMiddleware = require("../middleware/ensureUserAuth")

routes.get('/config', configController.index)
routes.post('/config/:value', ensureUserAuthMiddleware, configController.change)

module.exports = routes