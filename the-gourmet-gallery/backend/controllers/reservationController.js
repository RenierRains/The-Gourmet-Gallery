const Reservation = require('../models/Reservation');

exports.createReservation = async (req, res) => {
try {
    // ensure auth
    if (!req.user || !req.user.id) {
    return res.status(401).json({ message: 'User not authenticated' });
    }

    const { phone, date, time, guests, specialRequests } = req.body;

    //validation
    if (!phone || !date || !time || !guests) {
    return res.status(400).json({ message: 'Please fill in all required fields.' });
    }

    // user logged in req as username and em
    const name = req.user.username;
    const email = req.user.email;

    // create
    const reservation = await Reservation.create({
    name,
    email,
    phone,
    date,
    time,
    guests,
    specialRequests,
    UserId: req.user.id,
    });

    res.status(201).json({ message: 'Reservation created successfully', reservation });
} catch (error) {
    console.error('Error creating reservation:', error);
    res.status(500).json({ message: 'Server error', error });
}
};

exports.getUserReservations = async (req, res) => {
    try {
      const userId = req.user.id;
  
      const reservations = await Reservation.findAll({
        where: { UserId: userId },
        order: [['date', 'ASC'], ['time', 'ASC']],
      });
  
      res.status(200).json({ reservations });
    } catch (error) {
      console.error('Error fetching reservations:', error);
      res.status(500).json({ message: 'Server error', error });
    }
  };

  exports.deleteReservation = async (req, res) => {
    try {
      const userId = req.user.id;
      const reservationId = req.params.id;
  
      // find 
      const reservation = await Reservation.findOne({
        where: {
          id: reservationId,
          UserId: userId, // check if user is user
        },
      });
  
      if (!reservation) {
        return res.status(404).json({ message: 'Reservation not found' });
      }
  
      // delete
      await reservation.destroy();
  
      res.status(200).json({ message: 'Reservation cancelled successfully' });
    } catch (error) {
      console.error('Error cancelling reservation:', error);
      res.status(500).json({ message: 'Server error', error });
    }
  };