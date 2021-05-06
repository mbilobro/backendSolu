const crypto = require('crypto')
const moment = require('moment')
const { hash } = require('bcrypt')
const User = require('../models/User')
const { getRepository } = require("typeorm")
const UserView = require('../views/user_view')
const emailValidator = require('email-validator')
const ResetPassword = require('../models/ResetPassword')
const transporterConfig = require('../config/transporter')

require('dotenv/config')

module.exports = {
    async index(req, res) {
        const userRepository = getRepository(User)
        const users = await userRepository.find()
        return res.json(UserView.renderMany(users))
    }, 
    async get(req, res) {
        const { id } = req.params
        
        try {
            const userRepository = getRepository(User)
            const user = await userRepository.findOneOrFail(id)
            return res.json(UserView.render(user))
        } catch(error) {
            return res.status(404).send({
                error: 'user not found'
            })
        }
    },
    async create(req, res) {
        const {
            email,
            avatar,
            password,
            user_name,
            admin = false
        } = req.body

        if(!password) return res.status(400).send({
            error: 'password is null'
        })
        if(password.length > 45) return res.status(400).send({
            error: 'password exceed 45 char'
        })
        if(email.length > 45) return res.status(400).send({
            error: 'email exceed 45 char'
        })
        if(!emailValidator.validate(email)) return res.status(400).send({
            error: 'email is not valid'
        })
        if(user_name.length > 45) return res.status(400).send({
            error: 'user_name exceed 45 char'
        })

        try {
            const userRepository = getRepository(User)
            const hasUser = await userRepository.findOne(email)
            if(hasUser) return res.status(400).send({
                error: 'user already exists'
            })

            const user = userRepository.create({
                email,
                admin,
                avatar,
                name: user_name,
                password: await hash(password, 10),
                created_at: moment().utcOffset("-03:00").format('YYYY-MM-DD hh:mm:ss')
            })
            await userRepository.save(user)

            transporterConfig('welcome').sendMail({
                from: process.env.NODEMAILER_EMAIL,
                to: email,
                subject: 'Confirmação',
                template: 'index',
                context: {
                    name: user_name.toUpperCase(),
                    linkAccount: `${process.env.WEB_BASE_URL}`,
                    linkBlog: `${process.env.WEB_BASE_URL}/blog`,
                }
            }).catch(error => {
                return res.status(500).send({
                    error: error.message
                })
            })
            user.password = undefined
            return res.status(201).json(user)
        
        } catch(error) {
            return res.status(500).send({
                error: error.message
            })
        }
    },
    async delete(req, res) {
        const { id } = req.params

        try {
            const userRepository = getRepository(User)
            const user = await userRepository.findOne({
                where: { id },
            })
            if(!user) return res.status(404).send({
                error: 'user not found'
            })
            userRepository.remove(user)
            return res.status(200).send()
        } catch(error) {
            return res.status(500).send({
                error: error.message
            })
        }
    },
    async update(req, res) {
        const { id } = req.params

        const {
            avatar,
            name,
        } = req.body

        try {
            const userRepository = getRepository(User)
            const hasUser = await userRepository.findOne({
                where: { id },
            })
            if(!hasUser) return res.status(404).send({
                error: 'user not found'
            })

            await userRepository.update(id, {
                name,
                avatar
            })
            return res.status(200).send()
        } catch(error) {
            return res.status(500).send({
                error: error.message
            })
        }
    },
    async forgotPassword(req, res) {
        const { email } = req.body

        try {
            const userRepository = getRepository(User)
            const user = await userRepository.findOne({
                where: { email },
            })
            if(!user) return res.status(404).send({
                error: 'user not found'
            })

            const expiresIn = new Date()
            expiresIn.setHours(expiresIn.getHours() + 1)
            const token = crypto.randomBytes(20).toString('hex')

            const resetPasswordRepository = getRepository(ResetPassword)
            const request = await resetPasswordRepository.findOne({
                where: {
                    user_id: user.id
                }
            })
            if(request) {
                await resetPasswordRepository.update(user.id, {
                    token,
                    expiresIn
                })
            }  else {
                const newRequest = await resetPasswordRepository.create({
                    token, 
                    expiresIn,
                    user_id: user.id
                })
                resetPasswordRepository.save(newRequest)
            }

            transporterConfig('resetPassword').sendMail({
                from: process.env.NODEMAILER_EMAIL,
                to: email,
                subject: 'Redefinição',
                template: 'index',
                context: {
                    name: user.name.toUpperCase(),
                    link: `${process.env.WEB_BASE_URL}/reset/page/${token}`
                }
            }).then(() => {
                return res.status(200).send()
            })
            .catch(error => {
                return res.status(500).send({
                    error: error.message
                })
            })
        
        } catch(error) {
            return res.status(500).send({
                error: error.message
            })
        }
    },
    async resetPassword(req, res) {
        const { token } = req.query
        const { email, newPassword } = req.body

        try {
            const userRepository = getRepository(User)
            const user = await userRepository.findOne({
                where: { email },
            })
            if(!user) return res.status(404).send({
                error: 'user not found'
            })

            const resetPasswordRepository = getRepository(ResetPassword)
            const request = await resetPasswordRepository.findOne({
                where: {
                    user_id: user.id,
                }
            })
            if(!request) return res.status(404).send({
                error: 'request to reset_password not found'
            })
            if(token !== request.token) return res.status(401).send({
                error: 'invalid token'
            })
            const now = new Date()
            if(now > new Date(request.expiresIn)) return res.status(401).send({
                error: 'token expired'
            })

            await userRepository.update(user.id, {
                password: await hash(newPassword, 10)
            })

            resetPasswordRepository.remove(request)
            return res.status(200).send()

        } catch(error) {
            return res.status(500).send({
                error: error.message
            })
        }
    }
}