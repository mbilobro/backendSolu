const routes = require('express').Router()
const commentController = require('../controllers/CommentController')

routes.get('/comments', commentController.index)
routes.get('/comments/count', commentController.count)

module.exports = routes