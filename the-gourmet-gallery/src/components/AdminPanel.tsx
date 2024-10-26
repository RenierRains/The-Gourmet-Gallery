import React, { useEffect, useState } from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import ManageUsers from './ManageUsers';
import ManageReservations from './ManageReservations';
import ManageMenuItems from './ManageMenuItems';
import adminService from '../services/adminService';
import './AdminPanel.css';

const AdminPanel: React.FC = () => {
  const [pendingCount, setPendingCount] = useState<number>(0);

  const fetchPendingCount = async () => {
    try {
      const count = await adminService.getPendingReservationsCount();
      setPendingCount(count);
    } catch (error) {
      console.error('Error fetching pending reservations count:', error);
    }
  };

  useEffect(() => {
    fetchPendingCount();

    // Optional: Polling interval to refresh count every minute
    const interval = setInterval(fetchPendingCount, 60000);

    return () => clearInterval(interval);
  }, []);

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
                Users
              </NavLink>
            </li>
            <li>
              <NavLink
                to="reservations"
                className={({ isActive }) => (isActive ? 'active-link' : '')}
              >
                Reservations
                {pendingCount > 0 && (
                  <span className="notification-badge">{pendingCount}</span>
                )}
              </NavLink>
            </li>
            <li>
              <NavLink
                to="menu-items"
                className={({ isActive }) => (isActive ? 'active-link' : '')}
              >
                Menu Items
              </NavLink>
            </li>
          </ul>
        </nav>
        <div className="admin-content">
          <Routes>
            <Route path="users" element={<ManageUsers />} />
            <Route
              path="reservations"
              element={
                <ManageReservations refreshPendingCount={fetchPendingCount} />
              }
            />
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