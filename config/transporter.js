const path = require('path')
const nodemailer = require('nodemailer')
const hbs = require('nodemailer-express-handlebars')

module.exports = function config(folder) {
    
    const transporter = nodemailer.createTransport({
        host: process.env.NODEMAILER_HOST,
        port: process.env.NODEMAILER_PORT,
        secure: true,
        auth: {
            user: process.env.NODEMAILER_EMAIL,
            pass: process.env.NODEMAILER_PASSWORD
        }
    })
    
    transporter.use('compile', hbs({
        extName: '.handlebars',
        viewPath: path.resolve(__dirname, '..', 'public', 'views', folder),
        viewEngine: {
            extName: '.handlebars',
            partialsDir: path.resolve(__dirname, '..', 'public', 'views', folder),
            defaultLayout: false,
        }
    }))

    return transporter   
}