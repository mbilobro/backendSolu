const cors = require('cors')
const express = require('express')
const multiparty = require('connect-multiparty')
const MultipartyMiddleware = multiparty({uploadDir: './uploads'})
const Yup = require('yup');

const bodyparser = require('body-parser')
const morgan = require('morgan')
const app = express()
const routes = require('./routes/index.routes')

app.use("/files", express.static('uploads'));

const {createConnection} = require("typeorm");

// Seta variável global para caminho físico ao baseDir da aplicação
global.__basedir = __dirname;

const PORT = process.env.PORT || 3005

createConnection({
    "type": process.env.TYPEORM_DEFAULT_TYPE,
    "host": process.env.TYPEORM_DEFAULT_HOST,
    "port": process.env.TYPEORM_DEFAULT_PORT,
    "username": process.env.TYPEORM_DEFAULT_USERNAME,
    "password": process.env.TYPEORM_DEFAULT_PASSWORD,
    "database": process.env.TYPEORM_DEFAULT_DATABASE,
    // logging: true,
    "options": {
        "encrypt": false,
        "enableArithAbort": true
    },
    "entities": [        
        require("./models/Post"),
        require("./models/Category"),
        require("./models/Comment"),
        require("./models/User"),
        require("./models/Downloadable"),
        require("./models/ResetPassword"),
        require("./models/Like"),
        require("./models/ConfigPS"),
    ]  
});

// app.use(DBConnection)
app.use(cors());
app.use(bodyparser.urlencoded({extended: true}))
app.use(bodyparser.json())
app.use(express.json());


app.get('/', (req, res) => {
    res.status(200).json({
        message: "Testando"
    })
})

// app.post('/upload', MultipartyMiddleware, (req, res) => {    
//     var imagePath = req.files.upload.path;
//     return imagePath
// })

app.use(routes)


app.listen(PORT, console.log(`Server has started at ${PORT}!`))