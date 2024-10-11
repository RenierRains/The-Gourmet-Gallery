import React, { useState, useEffect, useContext } from 'react';
import { Menu as IconMenu, X } from 'lucide-react';
import { Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import MainPage from './components/MainPage';
import Menu from './components/menu';
import { AuthContext } from './contexts/AuthContext';
import './App.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const AppContent: React.FC = () => {
  const { isAuthenticated } = useContext(AuthContext);
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
            <li><a href="#menu">Menu</a></li>
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
          </ul>
        </nav>
      </header>

      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login />} />
        <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/menu" element={<Menu />} />
      </Routes>
    </div>
  );
};

export default AppContent;