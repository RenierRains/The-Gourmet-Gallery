import axios from 'axios';

const API_URL = 'http://localhost:5000/api/admin/';

const getUsers = async () => {
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

  const response = await axios.get(`${API_URL}users`, config);
  return response.data;
};

const deleteUser = async (id: number) => {
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

  const response = await axios.delete(`${API_URL}users/${id}`, config);
  return response.data;
};

const getReservations = async () => {
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

  const response = await axios.get(`${API_URL}reservations`, config);
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

  const response = await axios.delete(`${API_URL}reservations/${id}`, config);
  return response.data;
};

const updateReservation = async (id: number, data: any) => {
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

  const response = await axios.put(`${API_URL}reservations/${id}`, data, config);
  return response.data;
};

export default {
  getUsers,
  deleteUser,
  getReservations,
  deleteReservation,
  updateReservation,
};