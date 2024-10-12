import React, { useState, useEffect, useContext } from 'react';
import reservationService from '../services/reservationService';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
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
    dateTime: new Date(), // Use Date object for date and time
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
    const { phone, dateTime, guests } = formData;
    if (!phone || !dateTime || !guests) {
      setMessage('Please fill in all required fields.');
      return;
    }

    const reservationData = {
      phone,
      date: dateTime.toISOString().split('T')[0], // Format date to YYYY-MM-DD
      time: dateTime.toTimeString().split(' ')[0].slice(0, 5), // Format time to HH:mm
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
        dateTime: new Date(),
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
          <label htmlFor="dateTime">Date and Time<span>*</span></label>
          <DatePicker
            selected={formData.dateTime}
            onChange={(date) => handleChange('dateTime', date)}
            minDate={new Date()}
            showTimeSelect
            timeIntervals={15}
            dateFormat="MMMM d, yyyy h:mm aa"
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