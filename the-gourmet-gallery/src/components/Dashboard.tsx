import React, { useEffect, useState, useContext } from 'react';
import reservationService from '../services/reservationService';
import { AuthContext } from '../contexts/AuthContext';
import './Dashboard.css';
import { Trash2 } from 'lucide-react';
import { User, Phone, Calendar, Clock, Users, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Reservation {
  id: number;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  specialRequests?: string;
  createdAt: string;
  updatedAt: string;
}

const Dashboard: React.FC = () => {
  const { user, logout } = useContext(AuthContext);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [message, setMessage] = useState<string>('');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const data = await reservationService.getUserReservations();
        setReservations(data.reservations);
        setLoading(false);
      } catch (error: any) {
        console.error('Error fetching reservations:', error);
        setMessage(error.response?.data?.message || 'Failed to load reservations.');
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  const handleLogout = () => {
    logout();
  };

  const handleCancelReservation = async (id: number) => {
    if (window.confirm('Are you sure you want to cancel this reservation?')) {
      try {
        await reservationService.deleteReservation(id);
        setReservations(reservations.filter((res) => res.id !== id));
        setMessage('Reservation cancelled successfully.');
      } catch (error: any) {
        console.error('Error cancelling reservation:', error);
        setMessage(error.response?.data?.message || 'Failed to cancel reservation.');
      }
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Welcome, {user?.username}</h2>
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </div>
      <h3>Your Reservations</h3>
      {message && <p className="message">{message}</p>}
      {loading ? (
        <p>Loading reservations...</p>
      ) : reservations.length > 0 ? (
        <div className="reservations-grid">
          {reservations.map((reservation) => (
            <div className="reservation-card" key={reservation.id}>
              <div className="reservation-card-header">
                <h4>{reservation.date} at {reservation.time.slice(0, 5)}</h4>
                <button
                  className="cancel-button"
                  onClick={() => handleCancelReservation(reservation.id)}
                  title="Cancel Reservation"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <div className="reservation-card-body">
                <p><Users size={16} /> <strong>Guests:</strong> {reservation.guests}</p>
                <p><Phone size={16} /> <strong>Phone:</strong> {reservation.phone}</p>
                {reservation.specialRequests && (
                  <p><MessageSquare size={16} /> <strong>Special Requests:</strong> {reservation.specialRequests}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : ( <div className="empty-state">
      <p>You have no reservations.</p>
      <button className="make-reservation-button" onClick={() => navigate('/reservation')}>
        Make a Reservation
      </button>
    </div>
      )}
    </div>
  );
};

export default Dashboard;