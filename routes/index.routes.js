const routes = require('express').Router()

const userRoutes = require('./user.routes')
const postRoutes = require('./post.routes')
const commentRoutes = require('./comment.routes')
const categoryRoutes = require('./category.routes')
const configRoutes = require('./configps.routes')
const downloadableRoutes = require('./downloadable.routes')

routes.use(userRoutes)
routes.use(postRoutes)
routes.use(configRoutes)
routes.use(commentRoutes)
routes.use(categoryRoutes)
routes.use(downloadableRoutes)

module.exports = routes