import React, { useState, useEffect, useContext } from 'react';
import { Menu as IconMenu, X } from 'lucide-react';
import { Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import MainPage from './components/MainPage';
import Menu from './components/menu';
import ReservationPage from './components/ReservationPage';
import { AuthContext } from './contexts/AuthContext';
import AdminPanel from './components/AdminPanel';
import './App.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const AppContent: React.FC = () => {
  const { isAuthenticated, user } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Close the menu when navigating to a new route
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  return (
    <div>
      <header>
        <nav>
          <div className="logo">The Gourmet Gallery</div>
          <button className="menu-button" onClick={toggleMenu}>
            {isMenuOpen ? <X /> : <IconMenu />}
          </button>
          <ul className={isMenuOpen ? 'open' : ''}>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/menu">Menu</Link></li>
            <li><Link to="/reservation">Reservation</Link></li>
            <li><a href="#about">About</a></li>
            <li><a href="#contact">Contact</a></li>
            {!isAuthenticated && (
              <>
                <li><Link to="/login">Login</Link></li>
                <li><Link to="/register">Register</Link></li>
              </>
            )}
            {isAuthenticated && (
              <li><Link to="/dashboard">Dashboard</Link></li>
            )}
            {isAuthenticated && user?.isAdmin && (
              <li><Link to="/admin">Admin Panel</Link></li>
            )}
          </ul>
        </nav>
      </header>

      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login />} />
        <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/reservation" element={isAuthenticated ? <ReservationPage /> : <Navigate to="/login" />} />
        <Route
          path="/admin/*"
          element={isAuthenticated && user?.isAdmin ? <AdminPanel /> : <Navigate to="/login" />}
        />
      </Routes>
    </div>
  );
};

export default AppContent;
