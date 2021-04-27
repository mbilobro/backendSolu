const routes = require('express').Router()
const likeController = require('../controllers/LikesController')

routes.get('/likes/count', likeController.count)
routes.get('/likes/year', likeController.likesYear)


module.exports = routes