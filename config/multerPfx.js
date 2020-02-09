const multer = require('multer');
const path = require('path');

const dest = path.resolve(__dirname, '..', 'tmp', 'pfx');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, dest);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

module.exports = {
  dest,
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype == 'application/x-pkcs12') {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type.'));
    }
  },
};
