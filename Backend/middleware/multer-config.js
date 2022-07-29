const multer = require('multer');

const MIME_TYPES = {
'images/jpg':'jpg',
'images/jpeg':'jpg',
'images/png':'png'
}

const storage = multer.diskStorage({
    destination: (req,file,callback)=>{
        callback(null,'images')
    },
    filename: (res,file,callback)=>{
        const name = file.originalname.split(' ').join('_');
        const extension = MIME_TYPES[file.mimetype];
        callback(null,name + Date.now() + '.' + extension);
    }
});

modules.exports = multer({stroage}).single('image');