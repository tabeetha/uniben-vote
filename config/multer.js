const uuid = require('uuid');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, 'image/');
    },
    filename: function(req, file, cb){
        //cb(null, new Date().toISOString() + file.originalname);
        cb(null, uuid.v4() + file.originalname);
    }
});

const upload = multer({storage: storage, limits: 200});

module.exports = upload;