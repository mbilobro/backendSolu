const routes = require('express').Router()
const postController = require('../controllers/PostsController')
const ensureUserAuthMiddleware = require("../middleware/ensureUserAuth")

routes.post('/posts', ensureUserAuthMiddleware, postController.create)
routes.get('/posts', postController.index)
routes.get('/posts/count', postController.count)
routes.get('/posts/:id', postController.get)
routes.post('/posts/:id', ensureUserAuthMiddleware, postController.update)
routes.delete('/posts/:id', ensureUserAuthMiddleware, postController.delete)

module.exports = routes