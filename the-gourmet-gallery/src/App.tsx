import React, { useState, useEffect } from 'react';
import { Menu, X, MapPin, Phone, Clock, ChevronRight } from 'lucide-react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Slider from 'react-slick';
import Register from './components/Register';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import './App.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import menu from './components/menu';

const App: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('user'));

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const handleStorageChange = () => {
      setIsAuthenticated(!!localStorage.getItem('user'));
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Data for the menu slider
  const menuItems = [
    {
      name: 'Truffle Infused Risotto',
      image: 'naenae.jpg', // Placeholder image
      description: 'A creamy risotto with a hint of truffle flavor.',
    },
    {
      name: 'Seared Wagyu Steak',
      image: 'https://via.placeholder.com/400x300', // Placeholder image
      description: 'Juicy and tender steak with a perfect sear.',
    },
    {
      name: 'Deconstructed Lemon Tart',
      image: 'https://via.placeholder.com/400x300', // Placeholder image
      description: 'A modern take on the classic lemon tart.',
    },
  ];

  // Slider settings
  
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,        
    autoplaySpeed: 3000,    
    arrows: true,           
    pauseOnHover: true,     
  };

  return (
    <Router>
      <div>
        <header>
          <nav>
            <div className="logo">The Gourmet Gallery</div>
            <button className="menu-button" onClick={toggleMenu}>
              {isMenuOpen ? <X /> : <Menu />}
            </button>
            <ul className={isMenuOpen ? 'open' : ''}>
              <li><a href="#home">Home</a></li>
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

        <menu />

        <main>
          <Routes>
            <Route path="/" element={<Navigate to="/" />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} />
            <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
          </Routes>

          <section id="home">
            <div className="overlay"></div>
            <div>
              <h1 style={{ fontSize: '4rem', marginBottom: '1rem' }}>The Gourmet Gallery</h1>
              <p style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>Experience culinary artistry in every bite</p>
              <a href="#menu" style={{
                backgroundColor: '#a8552f',
                color: '#e6d5c5',
                padding: '1rem 2rem',
                textDecoration: 'none',
                fontWeight: 'bold',
                borderRadius: '5px',
              }}>Explore Our Menu</a>
            </div>
          </section>

          <section id="menu">
            <h2 style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '1.5rem', color: '#a8552f' }}>Our Menu</h2>

            {/* Slider for Menu Items */}
            <Slider {...sliderSettings}>
              {menuItems.map((dish) => (
                <div key={dish.name} className="menu-item">
                  <div className="card">
                    <img src={dish.image} alt={dish.name} style={{ width: '100%', height: 'auto' }} />
                    <div className="card-content">
                      <h3 style={{ padding: '.5rem', color: '#a8552f' }}>{dish.name}</h3>
                      <p style={{ padding: '0 .5rem .5rem', color: '#b3a395' }}>
                        {dish.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          </section>

          <section id="about" style={{ backgroundColor: '#2a1f1a', padding: '6rem 0' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
              <h2 style={{ fontSize: '2.5rem', marginBottom: '2rem', color: '#a8552f' }}>Our Story</h2>
              <p style={{ marginBottom: '2rem' }}>
                The Gourmet Gallery is a culinary haven where flavors are our canvas and dishes are our masterpieces. 
                Our passionate chefs craft each meal with precision, creativity, and the finest ingredients, 
                offering you an unforgettable dining experience in the heart of the city.
              </p>
              <a href="#contact" style={{
                display: 'inline-flex',
                alignItems: 'center',
                backgroundColor: '#a8552f',
                color: '#e6d5c5',
                padding: '0.5rem 1rem',
                textDecoration: 'none',
                fontWeight: 'bold',
                borderRadius: '5px',
              }}>
                Make a Reservation <ChevronRight size={20} />
              </a>
            </div>
          </section>

          <section id="contact">
            <h2 style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '10rem', color: '#a8552f' }}>Contact Us</h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '2rem',
              marginBottom: '3rem',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <MapPin style={{ color: '#a8552f', marginRight: '1rem' }} />
                <p>123 Gourmet Street, Foodville, FC 12345</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Phone style={{ color: '#a8552f', marginRight: '1rem' }} />
                <p>(123) 456-7890</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Clock style={{ color: '#a8552f', marginRight: '1rem' }} />
                <p>Mon-Sat: 5:00 PM - 11:00 PM<br />Sun: Closed</p>
              </div>
            </div>
          </section>
        </main>

        <footer className="footer">
          <p>&copy; 2024 The Gourmet Gallery. All rights reserved.</p>
        </footer>
      </div>
    </Router>
  );
};

export default App;
