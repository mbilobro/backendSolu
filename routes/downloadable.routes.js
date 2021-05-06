const routes = require('express').Router()
const downloadableController = require('../controllers/DownloadableController')
const ensureUserAuthMiddleware = require("../middleware/ensureUserAuth")

routes.get('/downloadable', downloadableController.index)
routes.post('/downloadable', ensureUserAuthMiddleware, downloadableController.create)
routes.put('/downloadable/:id', ensureUserAuthMiddleware, downloadableController.upload)
routes.delete('/downloadable/:id', ensureUserAuthMiddleware, downloadableController.delete)

module.exports = routes