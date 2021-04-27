const routes = require('express').Router()
const postController = require('../controllers/PostsController')

routes.post('/posts', postController.create)
routes.get('/posts', postController.index)
routes.get('/posts/count', postController.count)
routes.get('/posts/:id', postController.get)
routes.post('/posts/:id', postController.update)
routes.delete('/posts/:id', postController.delete)

module.exports = routes