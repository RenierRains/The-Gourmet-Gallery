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
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

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

  const categories = ['All', 'Appetizer', 'Main Course', 'Dessert', 'Beverage'];

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const filteredMenuItems = selectedCategory === 'All'
    ? menuItems
    : menuItems.filter((item) => item.category === selectedCategory);

  return (
    <main>
      <div className="menu-page">
        <h1>Menu</h1>

        {loading && <p>Loading menu...</p>}
        {error && <p className="error-message">{error}</p>}
        {!loading && !error && (
          <>
            <div className="category-filters">
              {categories.map((category) => (
                <button
                  key={category}
                  className={`filter-button ${selectedCategory === category ? 'active' : ''}`}
                  onClick={() => handleCategoryChange(category)}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="menu-cards">
              {filteredMenuItems.map((item) => (
                <div key={item.id} className="card fixed-size-card">
                  <img src={item.image} alt={item.name} className="card-img" />
                  <div className="card-body">
                    <h3 className="card-title">{item.name}</h3>
                    <p className="card-text">{item.description}</p>
                    <p className="card-price">₱{item.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
};

export default Menu;