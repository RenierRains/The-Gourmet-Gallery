import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import ManageUsers from './ManageUsers';
import ManageReservations from './ManageReservations';
import './AdminPanel.css';

const AdminPanel: React.FC = () => {
  return (
    <main>
    <div className="admin-panel">
      <nav className="admin-nav">
        <ul>
          <li><Link to="users">Manage Users</Link></li>
          <li><Link to="reservations">Manage Reservations</Link></li>
        </ul>
      </nav>
      <div className="admin-content">
        <Routes>
          <Route path="users" element={<ManageUsers />} />
          <Route path="reservations" element={<ManageReservations />} />
          <Route path="/" element={<h2>Welcome to the Admin Panel</h2>} />
        </Routes>
      </div>
    </div>
    </main>
  );
};

export default AdminPanel;