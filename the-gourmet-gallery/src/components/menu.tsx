import React from 'react';
import authService from '../services/authService';
import { useNavigate } from 'react-router-dom';
import './menu.css';
import { Link } from 'lucide-react';

const menuItems = {
  mainDish: [
    {
      name: "Grilled Chicken",
      image: "https://via.placeholder.com/150",
      description: "Juicy grilled chicken with a side of roasted vegetables."
    },
    {
      name: "Steak",
      image: "https://via.placeholder.com/150",
      description: "Tender and flavorful steak served with mashed potatoes."
    },
    {
      name: "Steak",
      image: "https://via.placeholder.com/150",
      description: "Tender and flavorful steak served with mashed potatoes."
    },
    {
      name: "Steak",
      image: "https://via.placeholder.com/150",
      description: "Tender and flavorful steak served with mashed potatoes."
    },
    {
      name: "Steak",
      image: "https://via.placeholder.com/150",
      description: "Tender and flavorful steak served with mashed potatoes."
    },
    {
      name: "Steak",
      image: "https://via.placeholder.com/150",
      description: "Tender and flavorful steak served with mashed potatoes."
    },
    {
      name: "Steak",
      image: "https://via.placeholder.com/150",
      description: "Tender and flavorful steak served with mashed potatoes."
    },
    {
      name: "Steak",
      image: "https://via.placeholder.com/150",
      description: "Tender and flavorful steak served with mashed potatoes."
    },
    {
      name: "Steak",
      image: "https://via.placeholder.com/150",
      description: "Tender and flavorful steak served with mashed potatoes."
    },
    {
      name: "Steak",
      image: "https://via.placeholder.com/150",
      description: "Tender and flavorful steak served with mashed potatoes."
    },
  ],
  appetizer: [
    {
      name: "Bruschetta",
      image: "https://via.placeholder.com/150",
      description: "Toasted bread topped with tomatoes, garlic, and basil."
    },
    {
      name: "Mozzarella Sticks",
      image: "https://via.placeholder.com/150",
      description: "Fried mozzarella sticks served with marinara sauce."
    },
    {
      name: "Bruschetta",
      image: "https://via.placeholder.com/150",
      description: "Toasted bread topped with tomatoes, garlic, and basil."
    },
    {
      name: "Bruschetta",
      image: "https://via.placeholder.com/150",
      description: "Toasted bread topped with tomatoes, garlic, and basil."
    },
    {
      name: "Bruschetta",
      image: "https://via.placeholder.com/150",
      description: "Toasted bread topped with tomatoes, garlic, and basil."
    },
    {
      name: "Bruschetta",
      image: "https://via.placeholder.com/150",
      description: "Toasted bread topped with tomatoes, garlic, and basil."
    },
    {
      name: "Bruschetta",
      image: "https://via.placeholder.com/150",
      description: "Toasted bread topped with tomatoes, garlic, and basil."
    },
    {
      name: "Bruschetta",
      image: "https://via.placeholder.com/150",
      description: "Toasted bread topped with tomatoes, garlic, and basil."
    },
    {
      name: "Bruschetta",
      image: "https://via.placeholder.com/150",
      description: "Toasted bread topped with tomatoes, garlic, and basil."
    },
    {
      name: "Bruschetta",
      image: "https://via.placeholder.com/150",
      description: "Toasted bread topped with tomatoes, garlic, and basil."
    },
  ],
  dessert: [
    {
      name: "Chocolate Lava Cake",
      image: "https://via.placeholder.com/150",
      description: "Rich molten chocolate cake with vanilla ice cream."
    },
    {
      name: "Cheesecake",
      image: "https://via.placeholder.com/150",
      description: "Creamy cheesecake with a graham cracker crust."
    },
    {
      name: "Cheesecake",
      image: "https://via.placeholder.com/150",
      description: "Creamy cheesecake with a graham cracker crust."
    },
    {
      name: "Cheesecake",
      image: "https://via.placeholder.com/150",
      description: "Creamy cheesecake with a graham cracker crust."
    },
    {
      name: "Cheesecake",
      image: "https://via.placeholder.com/150",
      description: "Creamy cheesecake with a graham cracker crust."
    },
    {
      name: "Cheesecake",
      image: "https://via.placeholder.com/150",
      description: "Creamy cheesecake with a graham cracker crust."
    },
    {
      name: "Cheesecake",
      image: "https://via.placeholder.com/150",
      description: "Creamy cheesecake with a graham cracker crust."
    },
    {
      name: "Cheesecake",
      image: "https://via.placeholder.com/150",
      description: "Creamy cheesecake with a graham cracker crust."
    },
    {
      name: "Cheesecake",
      image: "https://via.placeholder.com/150",
      description: "Creamy cheesecake with a graham cracker crust."
    },
    {
      name: "Cheesecake",
      image: "https://via.placeholder.com/150",
      description: "Creamy cheesecake with a graham cracker crust."
    },
  ],
  drinks: [
    {
      name: "Iced Lemonade",
      image: "https://via.placeholder.com/150",
      description: "Refreshing lemonade served with ice."
    },
    {
      name: "Cappuccino",
      image: "https://via.placeholder.com/150",
      description: "Creamy cappuccino with a frothy top."
    },
    {
      name: "Cappuccino",
      image: "https://via.placeholder.com/150",
      description: "Creamy cappuccino with a frothy top."
    },
    {
      name: "Cappuccino",
      image: "https://via.placeholder.com/150",
      description: "Creamy cappuccino with a frothy top."
    },
    {
      name: "Cappuccino",
      image: "https://via.placeholder.com/150",
      description: "Creamy cappuccino with a frothy top."
    },
    {
      name: "Cappuccino",
      image: "https://via.placeholder.com/150",
      description: "Creamy cappuccino with a frothy top."
    },
    {
      name: "Cappuccino",
      image: "https://via.placeholder.com/150",
      description: "Creamy cappuccino with a frothy top."
    },
    {
      name: "Cappuccino",
      image: "https://via.placeholder.com/150",
      description: "Creamy cappuccino with a frothy top."
    },
    {
      name: "Cappuccino",
      image: "https://via.placeholder.com/150",
      description: "Creamy cappuccino with a frothy top."
    },
    {
      name: "Cappuccino",
      image: "https://via.placeholder.com/150",
      description: "Creamy cappuccino with a frothy top."
    },
  ]
};

const Menu: React.FC = () => {
  return (
    <div className="menu">
      <h1>Menu</h1>

      <section className="menu-category">
        <h2>Main Dish</h2>
        <div className="menu-cards">
          {menuItems.mainDish.map((item, index) => (
            <div key={index} className="card">
              <img src={item.image} alt={item.name} className="card-img" />
              <div className="card-body">
                <h3 className="card-title">{item.name}</h3>
                <p className="card-text">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="menu-category">
        <h2>Appetizer</h2>
        <div className="menu-cards">
          {menuItems.appetizer.map((item, index) => (
            <div key={index} className="card">
              <img src={item.image} alt={item.name} className="card-img" />
              <div className="card-body">
                <h3 className="card-title">{item.name}</h3>
                <p className="card-text">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="menu-category">
        <h2>Dessert</h2>
        <div className="menu-cards">
          {menuItems.dessert.map((item, index) => (
            <div key={index} className="card">
              <img src={item.image} alt={item.name} className="card-img" />
              <div className="card-body">
                <h3 className="card-title">{item.name}</h3>
                <p className="card-text">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="menu-category">
        <h2>Drinks</h2>
        <div className="menu-cards">
          {menuItems.drinks.map((item, index) => (
            <div key={index} className="card">
              <img src={item.image} alt={item.name} className="card-img" />
              <div className="card-body">
                <h3 className="card-title">{item.name}</h3>
                <p className="card-text">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Menu;
