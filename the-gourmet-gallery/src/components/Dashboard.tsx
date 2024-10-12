import React, { useEffect, useState, useContext } from 'react';
import reservationService from '../services/reservationService';
import { AuthContext } from '../contexts/AuthContext';
import './Dashboard.css';
import { Trash2 } from 'lucide-react'; // Import an icon for the cancel button

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
        // Remove the cancelled reservation from the state
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
      <h2>Welcome, {user?.username}</h2>
      <button onClick={handleLogout} className="logout-button">Logout</button>
      <h3>Your Reservations</h3>
      {message && <p className="message">{message}</p>}
      {loading ? (
        <p>Loading reservations...</p>
      ) : reservations.length > 0 ? (
        <table className="reservations-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Time</th>
              <th>Guests</th>
              <th>Phone</th>
              <th>Special Requests</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((reservation) => (
              <tr key={reservation.id}>
                <td>{reservation.date}</td>
                <td>{reservation.time.slice(0, 5)}</td>
                <td>{reservation.guests}</td>
                <td>{reservation.phone}</td>
                <td>{reservation.specialRequests || 'N/A'}</td>
                <td>
                  <button
                    className="cancel-button"
                    onClick={() => handleCancelReservation(reservation.id)}
                    title="Cancel Reservation"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>You have no reservations.</p>
      )}
    </div>
  );
};

export default Dashboard;