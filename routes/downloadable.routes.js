const routes = require('express').Router()
const downloadableController = require('../controllers/DownloadableController')

routes.get('/downloadable', downloadableController.index)
routes.post('/downloadable', downloadableController.create)
routes.put('/downloadable/:id', downloadableController.upload)
routes.delete('/downloadable/:id', downloadableController.delete)

module.exports = routes