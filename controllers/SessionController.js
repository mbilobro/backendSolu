const axios = require('axios')
const moment = require('moment')
const jwt = require('jsonwebtoken')
const { compare } = require('bcrypt')
const User = require('../models/User')
const { getRepository } = require("typeorm")
const { OAuth2Client } = require('google-auth-library')

require('dotenv/config')

const CLIENT_ID = process.env.GOOGLE_USER_ID
const GOOGLE_API_URL = 'https://www.googleapis.com/oauth2/v3/tokeninfo'

function generateToken(user) {
    const token = jwt.sign({
        id: user.id,
        name: user.name,
        admin: user.admin,
        email: user.email,
        avatar: user.avatar
        }, 
        process.env.JWT_SECRET_KEY_USER, 
        { expiresIn: 172800 } // 2 dias
    )
    return token
}

module.exports = {
    async login(req, res) {
        const { email, password } = req.body

        try {
            const userRepository = getRepository(User)
            const user = await userRepository.findOne({
                where: { email },
            })
            if(!user) return res.status(404).send({
                error: 'user not found'
            })
            
            await compare(password, user.password).then((response) => {
                if(!response) throw new Error('invalid credentials')
                user.password = undefined
                return res.status(200).send({
                    user: user,
                    token: generateToken(user)
                })
            }).catch((error) => {
                return res.status(401).send({
                    error: error.message
                })
            })
        } catch(error) {
            return res.status(500).send({
                error: error.message
            })
        }
    },
    async loginWithGoogleAcc(req, res) {
        const { token } = req.body

        if(!token) return res.status(400).send({
            error: 'token is null'
        })
        
        try {
            const client = new OAuth2Client(CLIENT_ID)
            async function verify() {
                const ticket = await client.verifyIdToken({
                    idToken: token,
                    audience: CLIENT_ID
                })
                const payload = ticket.getPayload()
                const userid = payload['sub']
            }
            verify().catch(() => {})

            const response = await axios.get(`${GOOGLE_API_URL}?id_token=${token}`)
            const googleUser = response.data
    
            const userRepository = getRepository(User)
            const hasUser = await userRepository.findOne({
                where: { email: googleUser.email },
            })
            if(hasUser) {
                hasUser.password = undefined
                return res.status(200).send({
                    user: hasUser,
                    token: generateToken(hasUser)
                })
            }
    
            const newUser = userRepository.create({
                admin: false,
                password: null,
                name: googleUser.name,
                email: googleUser.email,
                avatar: googleUser.picture,
                created_at: moment().utcOffset("-03:00").format('YYYY-MM-DD hh:mm:ss')
            })
            await userRepository.save(newUser)
            newUser.password = undefined
            return res.status(200).send({
                user: newUser,
                token: generateToken(newUser)
            })
        } catch(err) {
            return res.status(500).json({
                error: err.message
            })
        }
    }
}