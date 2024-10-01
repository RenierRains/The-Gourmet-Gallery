import React, { useState } from 'react';
import { Menu, X, MapPin, Phone, Clock, ChevronRight } from 'lucide-react';
import './App.css'; 

const App: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div>
      <header>
        <nav>
          <div className="logo">The Gourmet Gallery</div>
          <button className="menu-button" onClick={toggleMenu}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
          <ul className={isMenuOpen ? "open" : ""}>
            <li><a href="#home">Home</a></li>
            <li><a href="#menu">Menu</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </nav>
      </header>

      <main>
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
          <h2 style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '2rem', color: '#a8552f' }}>Our Menu</h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem',
          }}>
            {['Truffle Infused Risotto', 'Seared Wagyu Steak', 'Deconstructed Lemon Tart'].map((dish) => (
              <div key={dish} className="menu-item">
                <img src="/placeholder.svg" alt={dish} />
                <h3 style={{ padding: '1rem', color: '#a8552f' }}>{dish}</h3>
                <p style={{ padding: '0 1rem 1rem', color: '#b3a395' }}>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
              </div>
            ))}
          </div>
        </section>

        <section id="about" style={{
          backgroundColor: '#2a1f1a',
          padding: '6rem 0',
        }}>
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
          <h2 style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '2rem', color: '#a8552f' }}>Contact Us</h2>
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
        <p>&copy; 2023 The Gourmet Gallery. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
