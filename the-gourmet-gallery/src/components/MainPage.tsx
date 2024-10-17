import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import { ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import menuService from '../services/menuService';
import './MainPage.css';

interface MenuItem {
  id: number;
  name: string;
  description: string;
  image: string;
  category: string;
  price: number;
}

const MainPage: React.FC = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const data = await menuService.getMenuItems();
        setMenuItems(data);
        setLoading(false);
      } catch (err: any) {
        setError('Failed to fetch menu items.');
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, []);

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false,
    autoplaySpeed: 3000,
    arrows: true,
    pauseOnHover: true,
    centerMode: true,
    centerPadding: '100px',
  };


  const featuredItems = menuItems.slice(0, 3); // adjust for featured menu things 

  const navigate = useNavigate();

  const handleReservationClick = () => {
    navigate('/reservation');
  };

  return (
    <main>
      <section id="home" className="home-section">
        <div className="overlay"></div>
        <div className="home-content">
          {/*  */}
          <img src="/logo.png" alt="The Gourmet Gallery" className="main-logo" />
          <p>Experience culinary artistry in every bite.</p>
          <button onClick={handleReservationClick} className="explore-button">
            Make a Reservation <ChevronRight size={20} />
          </button>
        </div>
      </section>

      <section id="menu">
        <h2>Our Menu</h2>

        {loading && <p>Loading menu...</p>}
        {error && <p className="error-message">{error}</p>}
        {!loading && !error && (
          <>
            <Slider {...sliderSettings}>
              {featuredItems.map((dish) => (
                <div key={dish.id} className="menu-item">
                  <div className="card">
                    <img src={dish.image} alt={dish.name} />
                    <div className="card-content">
                      <h3>{dish.name}</h3>
                      <p>{dish.description}</p>
                      <p className="price">₱{dish.price}</p>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>

            <div className="view-menu-button">
              <Link to="/menu">View Full Menu</Link>
            </div>
          </>
        )}
      </section>

      <section id="about">
        <div className="about-content">
          <h2>Our Story</h2>
          <p>
            The Gourmet Gallery is a culinary haven where flavors are our canvas and dishes are our masterpieces.
            Our passionate chefs craft each meal with precision, creativity, and the finest ingredients,
            offering you an unforgettable dining experience in the heart of the city.
          </p>
          <a href="#contact" className="reservation-button">
            Make a Reservation <ChevronRight size={20} />
          </a>
        </div>
      </section>

      <section id="contact">
        <h2>Contact Us</h2>
        <div className="contact-info">
          <div>
            <p>Dagupan City, Pangasinan</p>
          </div>
          <div>
            <p>(+63) 968833410</p>
          </div>
          <div>
            <p>Mon-Sat: 5:00 PM - 11:00 PM<br />Sun: Closed</p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default MainPage;
