import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth/';

interface AuthResponse {
  message: string;
  token: string;
  user: {
    id: number;
    username: string;
    email: string;
  };
}

const register = async (username: string, email: string, password: string): Promise<AuthResponse> => {
  const response = await axios.post<AuthResponse>(API_URL + 'register', {
    username,
    email,
    password,
  });
  return response.data;
};

const login = async (email: string, password: string): Promise<AuthResponse> => {
  const response = await axios.post<AuthResponse>(API_URL + 'login', { email, password });
  return response.data;
};

const logout = (): void => {
  localStorage.removeItem('user');
};

const authService = {
  register,
  login,
  logout,
};

export default authService;