const PORT = process.env.PORT || 3005

const cors = require('cors')
const express = require('express')
const multiparty = require('connect-multiparty')
const MultipartyMiddleware = multiparty({uploadDir: './uploads'})
const Yup = require('yup');

const bodyparser = require('body-parser')
const morgan = require('morgan')
const app = express()
const routes = require('./routes/index.routes')

app.use(express.static('uploads'));

const {createConnection} = require("typeorm");

// Seta variável global para caminho físico ao baseDir da aplicação
global.__basedir = __dirname;

// #TODO: Separar em um arquivo de configuração
createConnection({
    "type": "mysql",
    "host": "us-cdbr-east-02.cleardb.com",
    "port": 3306,
    "username": "bed2e57733bf13",
    "password": "a0662b33",
    "database": "heroku_46108b30f819760",
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
        require("./models/ResetPassword"),
        require("./models/Like"),
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

app.post('/upload', MultipartyMiddleware, (req, res) => {    
    var imagePath = req.files.upload.path;
    return imagePath
})

app.use(routes)


app.listen(PORT, console.log(`Server has started at ${PORT}!`))