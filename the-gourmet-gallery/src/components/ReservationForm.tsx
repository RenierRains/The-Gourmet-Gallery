import React, { useState, useEffect, useContext } from 'react';
import reservationService from '../services/reservationService';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import TimePicker from 'react-time-picker';
import 'react-time-picker/dist/TimePicker.css';
import './ReservationForm.css';

const ReservationForm: React.FC = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const [formData, setFormData] = useState({
    phone: '',
    date: new Date(), // Use Date object for date picker
    time: '12:00',     // Default time
    guests: 1,
    specialRequests: '',
  });

  const [message, setMessage] = useState<string>('');
  const [success, setSuccess] = useState<boolean>(false);

  const handleChange = (name: string, value: any) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === 'guests' ? parseInt(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side validation
    const { phone, date, time, guests } = formData;
    if (!phone || !date || !time || !guests) {
      setMessage('Please fill in all required fields.');
      return;
    }

    const reservationData = {
      phone,
      date: date.toISOString().split('T')[0], // Format date to YYYY-MM-DD
      time,
      guests,
      specialRequests: formData.specialRequests,
    };

    try {
      await reservationService.createReservation(reservationData);
      setMessage('Reservation created successfully!');
      setSuccess(true);
      // Reset form
      setFormData({
        phone: '',
        date: new Date(),
        time: '12:00',
        guests: 1,
        specialRequests: '',
      });
    } catch (error: any) {
      console.error('Error creating reservation:', error);
      const errorMessage = error.response?.data?.message || 'Failed to create reservation.';
      setMessage(errorMessage);
      setSuccess(false);
    }
  };

  return (
    <div className="reservation-form-container">
      <h2>Make a Reservation</h2>
      {message && (
        <p className={`message ${success ? 'success' : 'error'}`}>{message}</p>
      )}
      <form className="reservation-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="phone">Phone<span>*</span></label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={(e) => handleChange(e.target.name, e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="date">Date<span>*</span></label>
          <DatePicker
            selected={formData.date}
            onChange={(date) => handleChange('date', date)}
            minDate={new Date()}
            dateFormat="yyyy-MM-dd"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="time">Time<span>*</span></label>
          <TimePicker
            onChange={(time) => handleChange('time', time)}
            value={formData.time}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="guests">Number of Guests<span>*</span></label>
          <input
            type="number"
            id="guests"
            name="guests"
            value={formData.guests}
            onChange={(e) => handleChange(e.target.name, e.target.value)}
            required
            min="1"
          />
        </div>
        <div className="form-group">
          <label htmlFor="specialRequests">Special Requests</label>
          <textarea
            id="specialRequests"
            name="specialRequests"
            value={formData.specialRequests}
            onChange={(e) => handleChange(e.target.name, e.target.value)}
            rows={4}
          ></textarea>
        </div>
        <button type="submit" className="reservation-button">Reserve Table</button>
      </form>
    </div>
  );
};

export default ReservationForm;