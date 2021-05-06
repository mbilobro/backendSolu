const jwt = require('jsonwebtoken')

require('dotenv/config')


module.exports = (req, res, next) => {

    const authHeader = req.headers.authorization
    if(!authHeader) return res.status(401).send({
        error: 'no token provided'
    })

    const parts = authHeader.split(' ')
    if(!parts.length === 2) return res.status(401).send({
        error: 'token error'
    })

    const [ scheme, token ] = parts
    if(!/^Bearer$/i.test(scheme)) return res.status(401).send({
        error: 'token malformatted'
    })

    jwt.verify(token, 
        process.env.JWT_SECRET_KEY_USER, 
        (err, decoded) => {
            if(err) return res.status(401).send({
                error: 'token invalid'
            })
            req.admin = decoded.admin
        return next()
    })

}