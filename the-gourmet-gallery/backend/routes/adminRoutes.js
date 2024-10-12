const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');


router.use(authMiddleware, adminMiddleware);

router.get('/users', adminController.getAllUsers);
router.post('/users', adminController.createUser);
router.put('/users/:id', adminController.updateUser);
router.delete('/users/:id', adminController.deleteUser);


router.get('/reservations', adminController.getAllReservations);
router.put('/reservations/:id', adminController.updateReservation);
router.delete('/reservations/:id', adminController.deleteReservation);

module.exports = router;