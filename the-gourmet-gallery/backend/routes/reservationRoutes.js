const express = require('express');
const router = express.Router();
const { createReservation } = require('../controllers/reservationController');
const authMiddleware = require('../middleware/authMiddleware'); // Import the middleware

// POST /api/reservations
router.post('/', authMiddleware, createReservation); // Apply middleware here

module.exports = router;