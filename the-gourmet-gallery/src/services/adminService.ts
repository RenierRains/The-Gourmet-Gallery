import axios from 'axios';

const API_URL = 'http://localhost:5000/api/admin/';
const MENU_API_URL = 'http://localhost:5000/api/menu/';
const RESERVATION_API_URL = 'http://localhost:5000/api/reservations/';

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

const getMenuItems = async () => {
  const token = localStorage.getItem('user');

  if (!token) {
    throw new Error('User not authenticated');
  }

  const response = await axios.get(`${MENU_API_URL}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

const createMenuItem = async (formData: FormData) => {
  const token = localStorage.getItem('user');

  if (!token) {
    throw new Error('User not authenticated');
  }

  const response = await axios.post(`${MENU_API_URL}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

const updateMenuItem = async (id: number, formData: FormData) => {
  const token = localStorage.getItem('user');

  if (!token) {
    throw new Error('User not authenticated');
  }

  const response = await axios.put(`${MENU_API_URL}${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

const deleteMenuItem = async (id: number) => {
  const token = localStorage.getItem('user');

  if (!token) {
    throw new Error('User not authenticated');
  }

  const response = await axios.delete(`${MENU_API_URL}${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

const exportReservations = async (format: 'csv' | 'xlsx') => {
  const token = localStorage.getItem('user');

  if (!token) {
    throw new Error('User not authenticated');
  }

  const response = await axios.get(`${RESERVATION_API_URL}export`, {
    params: { format },
    headers: {
      Authorization: `Bearer ${token}`,
    },
    responseType: 'blob', // Important for file downloads
  });

  return response.data;
};

export default {
  getUsers,
  deleteUser,
  getReservations,
  deleteReservation,
  updateReservation,
  getMenuItems,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  exportReservations,
};