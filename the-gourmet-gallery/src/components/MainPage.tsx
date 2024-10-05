import React from 'react';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import { ChevronRight } from 'lucide-react';
import './MainPage.css';

const MainPage: React.FC = () => {
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

  return (
    <main>
      <section id="home" style={{ marginBottom: '3rem' }}>
        <div className="overlay"></div>
        <div>
          <h1>The Gourmet Gallery</h1>
          <p>Experience culinary artistry in every bite</p>
          <a href="#menu" className="explore-button">Explore Our Menu</a>
        </div>
      </section>

      <section id="menu">
        <h2>Our Menu</h2>

        <Slider {...sliderSettings}>
          {menuItems.map((dish) => (
            <div key={dish.name} className="menu-item">
              <div className="card">
                <img src={dish.image} alt={dish.name} />
                <div className="card-content">
                  <h3>{dish.name}</h3>
                  <p>{dish.description}</p>
                </div>
              </div>
            </div>
          ))}
        </Slider>

        <div className="view-menu-button">
          <Link to="/menu">View Full Menu</Link>
        </div>
      </section>

      <section id="about">
        <div>
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
            <p>123 Gourmet Street, Foodville, FC 12345</p>
          </div>
          <div>
            <p>(123) 456-7890</p>
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
