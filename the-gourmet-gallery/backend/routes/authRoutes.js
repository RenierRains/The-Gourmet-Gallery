const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');

// reg
router.post('/register', register);

// login
router.post('/login', login);

module.exports = router;
