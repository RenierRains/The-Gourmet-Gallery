import axios from 'axios';

const API_URL = 'http://localhost:5000/api/reservations/';

interface ReservationData {
  phone: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  guests: number;
  specialRequests?: string;
}

const createReservation = async (reservationData: ReservationData) => {
  const token = localStorage.getItem('user');

  console.log('Token:', token); // debug

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  console.log('Authorization Header Sent:', config.headers.Authorization);

  const response = await axios.post(API_URL, reservationData, config);
  return response.data;
};

const getUserReservations = async () => {
  const token = localStorage.getItem('user');

  if (!token) {
    throw new Error('User not authenticated');
  }

  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(`${API_URL}user`, config);
  return response.data;
};

const deleteReservation = async (id: number) => {
  const token = localStorage.getItem('user');

  if (!token) {
    throw new Error('User not authenticated');
  }

  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.delete(`${API_URL}${id}`, config);
  return response.data;
};

export default {
  createReservation,
  getUserReservations,
  deleteReservation,
};