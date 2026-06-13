const multer = require('multer');
const path = require('path'); 
const {
  ALLOWED_FILE_TYPES,
  MAX_FILE_SIZE,
  UPLOAD_USER_IMG_DIRECTORY,
  UPLOAD_PRODUCT_IMG_DIRECTORY
} = require('../config');




const productStorage = multer.diskStorage({ 
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
})



const userStorage = multer.diskStorage({ 
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
})

const fileFilter = (req, file, cb) => {
  const extname = path.extname(file.originalname);

  if (!ALLOWED_FILE_TYPES.includes(extname.substring(1))) {
    return cb(new Error('File type not allowed'),
    false);
  }
  cb(null, true);
}


const uploadUserImage = multer({ storage: userStorage,
  limits: {fileSize: MAX_FILE_SIZE, }, 
  fileFilter,
});




const uploadImage = multer({ storage: productStorage,
  limits: {fileSize: MAX_FILE_SIZE, }, 
  fileFilter,
});




module.exports = { uploadUserImage, uploadImage };