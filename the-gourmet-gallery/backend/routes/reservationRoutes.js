const express = require('express');
const router = express.Router();
const { createReservation, getUserReservations, deleteReservation } = require('../controllers/reservationController');
const authMiddleware = require('../middleware/authMiddleware'); 

//get
router.get('/user', authMiddleware, getUserReservations);

// post
router.post('/', authMiddleware, createReservation); 

router.delete('/:id', authMiddleware, deleteReservation);

module.exports = router;