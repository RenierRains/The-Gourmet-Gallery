import React, { useState, useContext } from 'react';
import authService from '../services/authService';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import './Auth.css';

const Register: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await authService.register(username, email, password);
      // insta login after reg test
      const loginResponse = await authService.login(email, password);
      login(loginResponse.token, loginResponse.user);
      navigate('/');
    } catch (error: any) {
      console.error('Registration error:', error);
      setMessage(error.response?.data?.message || 'Registration failed');
    }
  };

  const handleClose = () => {
    navigate('/');
  };

  return (
    <div className="auth-overlay">
      <div className="auth-container">
        <button className="close-button" onClick={handleClose}>✖</button>
        <h2 className="auth-title">Register</h2>
        <form className="auth-form" onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="auth-button">Register</button>
        </form>
        {message && <p className="auth-message">{message}</p>}
        <p className="auth-switch">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;