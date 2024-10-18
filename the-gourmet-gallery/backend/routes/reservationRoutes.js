const express = require('express');
const router = express.Router();
const { createReservation, getUserReservations, deleteReservation, exportReservations } = require('../controllers/reservationController');
const authMiddleware = require('../middleware/authMiddleware'); 
const adminMiddleware = require('../middleware/adminMiddleware'); 

//get
router.get('/user', authMiddleware, getUserReservations);

// post
router.post('/', authMiddleware, createReservation); 

router.delete('/:id', authMiddleware, deleteReservation);

router.get('/export', authMiddleware, adminMiddleware, exportReservations);

module.exports = router;