const util = require("util");
const multer = require("multer");
const maxSize = 10 * 1024 * 1024;


let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __basedir + "/uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`)
  },
});

let uploadFile = multer({
  storage: storage,
  limits: { fileSize: maxSize },
}).array('file', 2)

let uploadFileMiddleware = util.promisify(uploadFile);
module.exports = uploadFileMiddleware;
