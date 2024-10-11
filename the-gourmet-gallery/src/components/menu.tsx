import React, { useEffect, useState } from 'react';
import menuService from '../services/menuService';
import './menu.css';

interface MenuItem {
  id: number;
  name: string;
  description: string;
  image: string;
  category: string;
  price: number;
}

const Menu: React.FC = () => {
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

  // Group menu items by category
  const categories = ['Appetizer', 'Main Course', 'Dessert', 'Beverage'];

  const groupedMenuItems = categories.map((category) => ({
    category,
    items: menuItems.filter((item) => item.category === category),
  }));

  return (
    <div className="menu-page">
      <h1>Menu</h1>

      {loading && <p>Loading menu...</p>}
      {error && <p className="error-message">{error}</p>}
      {!loading && !error && (
        groupedMenuItems.map((group) => (
          <section key={group.category} className="menu-category">
            <h2>{group.category}</h2>
            <div className="menu-cards">
              {group.items.map((item) => (
                <div key={item.id} className="card">
                  <img src={item.image} alt={item.name} className="card-img" />
                  <div className="card-body">
                    <h3 className="card-title">{item.name}</h3>
                    <p className="card-text">{item.description}</p>
                    <p className="card-price">₱{item.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))
      )}
    </div>
  );
};

export default Menu;
