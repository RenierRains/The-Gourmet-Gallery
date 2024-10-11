import React, { useContext } from 'react';
import authService from '../services/authService';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import './Dashboard.css'; // css kater

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const handleLogout = () => {
    authService.logout();
    logout(); // contexto
    navigate('/');
  };

  return (
    <div className="dashboard-container">
      <h1>Welcome to your Dashboard!</h1>
      <button onClick={handleLogout} className="logout-button">Logout</button>
    </div>
  );
};

export default Dashboard;