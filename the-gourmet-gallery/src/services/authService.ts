import axios from 'axios';

// backend url?
const API_URL = 'http://localhost:5000/api/auth/';

// register user
const register = async (username: string, email: string, password: string) => {
  const response = await axios.post(API_URL + 'register', {
    username,
    email,
    password,
  });
  if (response.data.token) {
    localStorage.setItem('user', JSON.stringify(response.data.token));
  }
  return response.data;
};

// login the user
const login = async (email: string, password: string) => {
  const response = await axios.post(API_URL + 'login', { email, password });
  if (response.data.token) {
    localStorage.setItem('user', JSON.stringify(response.data.token));
  }
  return response.data;
};

// logout
const logout = () => {
  localStorage.removeItem('user');
};

const authService = {
  register,
  login,
  logout,
};

export default authService;
