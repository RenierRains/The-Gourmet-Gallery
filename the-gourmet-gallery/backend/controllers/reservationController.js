const Reservation = require('../models/Reservation');
const { Parser } = require('json2csv');
const XLSX = require('xlsx');

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
    status: 'pending', // default status
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

      if (reservation.status === 'approved') {
        return res.status(403).json({ message: 'You cannot cancel an approved reservation.' });
      }
  
      // delete
      await reservation.destroy();
  
      res.status(200).json({ message: 'Reservation cancelled successfully' });
    } catch (error) {
      console.error('Error cancelling reservation:', error);
      res.status(500).json({ message: 'Server error', error });
    }
  };

  exports.exportReservations = async (req, res) => {
    try {
      const { format } = req.query;
  
      // validation
      if (!format || !['csv', 'xlsx'].includes(format.toLowerCase())) {
        return res.status(400).json({ message: 'Invalid format. Choose either csv or xlsx.' });
      }
  
      // fetch
      const reservations = await Reservation.findAll({
        // specific field option
        attributes: ['id', 'userId', 'date', 'time', 'guests', 'specialRequests','createdAt', 'updatedAt'],
      });
  
      if (!reservations.length) {
        return res.status(404).json({ message: 'No reservations found to export.' });
      }
  
      // json
      const data = reservations.map(reservation => reservation.toJSON());
  
      if (format.toLowerCase() === 'csv') {
        // json to csv
        const json2csvParser = new Parser();
        const csv = json2csvParser.parse(data);
  
        // file dl
        res.header('Content-Type', 'text/csv');
        res.attachment('reservations.csv');
        return res.send(csv);
      } else if (format.toLowerCase() === 'xlsx') {
        // json to worksheet
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Reservations');
  
        // buffer
        const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
  
        // file dl
        res.setHeader('Content-Disposition', 'attachment; filename="reservations.xlsx"');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        return res.send(buffer);
      }
  
    } catch (error) {
      console.error('Error exporting reservations:', error);
      res.status(500).json({ message: 'Server error while exporting reservations.', error });
    }
  };

  const getPendingReservationsCount = asyncHandler(async (req, res) => {
    const count = await Reservation.countDocuments({ status: 'pending' });
    res.json({ count });
  });