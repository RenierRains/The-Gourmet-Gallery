const User = require('../models/User');
const Reservation = require('../models/Reservation');
const bcrypt = require('bcrypt');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['passwordHash'] }, // Exclude passwordHash
    });
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { username, email, password, isAdmin } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      passwordHash,
      isAdmin: isAdmin || false,
    });

    res.status(201).json({ message: 'User created successfully', user });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const { username, email, password, isAdmin } = req.body;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.username = username || user.username;
    user.email = email || user.email;
    user.isAdmin = isAdmin !== undefined ? isAdmin : user.isAdmin;

    if (password) {
      user.passwordHash = await bcrypt.hash(password, 10);
    }

    await user.save();

    res.status(200).json({ message: 'User updated successfully', user });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.destroy();

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

exports.getAllReservations = async (req, res) => {
  try {
    const reservations = await Reservation.findAll({
      include: [{ model: User, attributes: ['username', 'email'] }],
      order: [['date', 'ASC'], ['time', 'ASC']],
    });
    res.status(200).json(reservations);
  } catch (error) {
    console.error('Error fetching reservations:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

exports.updateReservation = async (req, res) => {
  try {
    const reservationId = req.params.id;
    const { date, time, guests, specialRequests, status } = req.body;

    const reservation = await Reservation.findByPk(reservationId);
    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    reservation.date = date || reservation.date;
    reservation.time = time || reservation.time;
    reservation.guests = guests || reservation.guests;
    reservation.specialRequests = specialRequests || reservation.specialRequests;
    
    if (status) {
      if (['pending', 'approved', 'completed', 'canceled'].includes(status)) {
        reservation.status = status;
      } else {
        return res.status(400).json({ message: 'Invalid status value' });
      }
    }

    await reservation.save();

    res.status(200).json({ message: 'Reservation updated successfully', reservation });
  } catch (error) {
    console.error('Error updating reservation:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};
exports.deleteReservation = async (req, res) => {
  try {
    const reservationId = req.params.id;

    const reservation = await Reservation.findByPk(reservationId);
    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    await reservation.destroy();

    res.status(200).json({ message: 'Reservation deleted successfully' });
  } catch (error) {
    console.error('Error deleting reservation:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

exports.getPendingReservationsCount = async (req, res) => {
  try {
    const count = await Reservation.count({ where: { status: 'pending' } });
    res.status(200).json({ count });
  } catch (error) {
    console.error('Error fetching pending reservations count:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

