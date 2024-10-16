import React from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import ManageUsers from './ManageUsers';
import ManageReservations from './ManageReservations';
import ManageMenuItems from './ManageMenuItems';
import './AdminPanel.css';

const AdminPanel: React.FC = () => {
  return (
    <main>
        <div className="admin-panel">
      <nav className="admin-nav">
        <h2>Admin Panel</h2>
        <ul>
          <li>
            <NavLink
              to="users"
              className={({ isActive }) => (isActive ? 'active-link' : '')}
            >
              Manage Users
            </NavLink>
          </li>
          <li>
            <NavLink
              to="reservations"
              className={({ isActive }) => (isActive ? 'active-link' : '')}
            >
              Manage Reservations
            </NavLink>
          </li>
          <li>
              <NavLink
                to="menu-items"
                className={({ isActive }) => (isActive ? 'active-link' : '')}
              >
                Manage Menu Items
              </NavLink>
            </li>
        </ul>
      </nav>
      <div className="admin-content">
        <Routes>
          <Route path="users" element={<ManageUsers />} />
          <Route path="reservations" element={<ManageReservations />} />
          <Route path="menu-items/*" element={<ManageMenuItems />} />
          <Route
            path="/"
            element={
              <div className="welcome-message">
                <h2>Welcome to the Admin Panel</h2>
              </div>
            }
          />
        </Routes>
      </div>
    </div>
    </main>
  );
};

export default AdminPanel;