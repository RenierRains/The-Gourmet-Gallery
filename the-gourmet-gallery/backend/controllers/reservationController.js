const Reservation = require('../models/Reservation');

exports.createReservation = async (req, res) => {
try {
    // Ensure the user is authenticated
    if (!req.user || !req.user.id) {
    return res.status(401).json({ message: 'User not authenticated' });
    }

    const { phone, date, time, guests, specialRequests } = req.body;

    // Server-side validation
    if (!phone || !date || !time || !guests) {
    return res.status(400).json({ message: 'Please fill in all required fields.' });
    }

    // Use user's name and email from req.user
    const name = req.user.username;
    const email = req.user.email;

    // Create reservation with associated user
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