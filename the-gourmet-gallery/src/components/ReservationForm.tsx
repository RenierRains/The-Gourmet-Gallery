import React, { useState, useEffect, useContext } from 'react';
import reservationService from '../services/reservationService';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext'; // for auth
import './ReservationForm.css';

const ReservationForm: React.FC = () => {
  const { isAuthenticated, user } = useContext(AuthContext); // gett auth stat
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login'); // redirect if not auth
    }
  }, [isAuthenticated, navigate]);

  const [formData, setFormData] = useState({
    phone: '',
    date: '',
    time: '',
    guests: 1,
    specialRequests: '',
  });

  const [message, setMessage] = useState<string>('');
  const [success, setSuccess] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

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
  
    // Exclude name and email from reservationData
    const reservationData = {
      phone,
      date,
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
        date: '',
        time: '',
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
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="date">Date<span>*</span></label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            min={new Date().toISOString().split('T')[0]} // lock past dates
          />
        </div>
        <div className="form-group">
          <label htmlFor="time">Time<span>*</span></label>
          <input
            type="time"
            id="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
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
            onChange={handleChange}
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
            onChange={handleChange}
            rows={4}
          ></textarea>
        </div>
        <button type="submit" className="reservation-button">Reserve Table</button>
      </form>
    </div>
  );
};

export default ReservationForm;