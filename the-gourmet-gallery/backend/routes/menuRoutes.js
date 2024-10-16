const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');
const multer = require('multer');
const path = require('path');

// multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '../public/uploads'); // directory
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimeType = allowedTypes.test(file.mimetype);
  
  if (extName && mimeType) {
    return cb(null, true);
  } else {
    cb(new Error('Only images are allowed'));
  }
};

// init
const upload = multer({ storage, fileFilter });

// Routes
router.get('/', menuController.getMenuItems);
router.get('/:id', menuController.getMenuItemById);
router.post('/', upload.single('image'), menuController.createMenuItem);
router.put('/:id', upload.single('image'), menuController.updateMenuItem);
router.delete('/:id', menuController.deleteMenuItem);

module.exports = router;
