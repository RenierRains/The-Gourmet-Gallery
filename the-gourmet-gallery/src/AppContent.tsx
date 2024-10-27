import React, { useState, useEffect, useContext } from 'react';
import { Menu as IconMenu, X } from 'lucide-react';
import { Routes, Route, Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link'; 
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
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate(); 

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // close
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div>
      <header>
        <nav>
          <img src="/logo-header.png" alt="The Gourmet Gallery" className="header-logo" />
          <button className="menu-button" onClick={toggleMenu}>
            {isMenuOpen ? <X /> : <IconMenu />}
          </button>
          <ul className={isMenuOpen ? 'open' : ''}>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/menu">Menu</Link></li>
            <li><Link to="/reservation">Reservation</Link></li>
            <li>
              <HashLink smooth to="/#about">About</HashLink>
            </li>
            <li>
              <HashLink smooth to="/#contact">Contact</HashLink>
            </li>
            {!isAuthenticated ? (
              <>
                <li>
                  <button onClick={() => navigate('/login')} className="nav-button">Login</button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/dashboard">Dashboard</Link>
                </li>
                {user?.isAdmin && (
                  <li><Link to="/admin">Admin Panel</Link></li>
                )}
                <li>
                  <button onClick={handleLogout} className="nav-button">Logout</button>
                </li>
              </>
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
