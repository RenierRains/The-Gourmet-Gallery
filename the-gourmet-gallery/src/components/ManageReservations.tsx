import React, { useEffect, useState } from 'react';
import adminService from '../services/adminService';
import './ManageReservations.css';

interface Reservation {
  id: number;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  specialRequests?: string;
  userId: number;
  User: {
    username: string;
    email: string;
  };
}

const ManageReservations: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const data = await adminService.getReservations();
        setReservations(data);
        setLoading(false);
      } catch (error: any) {
        console.error('Error fetching reservations:', error);
        setMessage('Failed to load reservations.');
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  const handleDeleteReservation = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this reservation?')) {
      try {
        await adminService.deleteReservation(id);
        setReservations(reservations.filter((res) => res.id !== id));
        setMessage('Reservation deleted successfully.');
      } catch (error: any) {
        console.error('Error deleting reservation:', error);
        setMessage('Failed to delete reservation.');
      }
    }
  };

  return (
    <div className="manage-reservations">
      <h2>Manage Reservations</h2>
      {message && <p className="message">{message}</p>}
      {loading ? (
        <p>Loading reservations...</p>
      ) : reservations.length > 0 ? (
        <table className="reservations-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>User</th>
              <th>Date</th>
              <th>Time</th>
              <th>Guests</th>
              <th>Phone</th>
              <th>Special Requests</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((res) => (
              <tr key={res.id}>
                <td>{res.id}</td>
                <td>{res.User.username}</td>
                <td>{res.date}</td>
                <td>{res.time.slice(0, 5)}</td>
                <td>{res.guests}</td>
                <td>{res.phone}</td>
                <td>{res.specialRequests || 'N/A'}</td>
                <td>
                  {/* Add edit functionality if needed */}
                  <button
                    className="delete-button"
                    onClick={() => handleDeleteReservation(res.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No reservations found.</p>
      )}
    </div>
  );
};

export default ManageReservations;