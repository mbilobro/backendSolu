const routes = require('express').Router()

const userRoutes = require('./user.routes')
const postRoutes = require('./post.routes')
const commentRoutes = require('./comment.routes')
const categoryRoutes = require('./category.routes')

routes.use(userRoutes)
routes.use(postRoutes)
routes.use(commentRoutes)
routes.use(categoryRoutes)

module.exports = routes