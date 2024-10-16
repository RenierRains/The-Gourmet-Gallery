import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import adminService from '../services/adminService';
import { X } from 'lucide-react';


interface MenuItem {
  id: number;
  name: string;
  description: string;
  image: string;
  category: string;
  price: string;
}

interface EditMenuItemProps {
  menuItem: MenuItem;
  onClose: () => void;
  onUpdate: (updatedItem: MenuItem) => void;
}

const EditMenuItem: React.FC<EditMenuItemProps> = ({ menuItem, onClose, onUpdate }) => {
  const [name, setName] = useState<string>(menuItem.name);
  const [description, setDescription] = useState<string>(menuItem.description);
  const [category, setCategory] = useState<string>(menuItem.category);
  const [price, setPrice] = useState<string>(menuItem.price);
  const [image, setImage] = useState<File | null>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    setName(menuItem.name);
    setDescription(menuItem.description);
    setCategory(menuItem.category);
    setPrice(menuItem.price);
  }, [menuItem]);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !description || !category || !price) {
      setError('Name, Description, Category, and Price are required.');
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('category', category);
    formData.append('price', price);
    if (image) {
      formData.append('image', image);
    }

    try {
      const response = await adminService.updateMenuItem(menuItem.id, formData);
      onUpdate(response.menuItem);
    } catch (err: any) {
      console.error('Error updating menu item:', err);
      setError(err.response?.data?.message || 'Failed to update menu item.');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <button className="close-button" onClick={onClose}>
          <X size={20} />
        </button>
        <h3>Edit Menu Item</h3>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit} className="edit-menu-item-form">
          <label>
            Name:
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>
          <label>
            Description:
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
          </label>
          <label>
            Category:
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="">Select Category</option>
              <option value="Appetizer">Appetizer</option>
              <option value="Main Course">Main Course</option>
              <option value="Dessert">Dessert</option>
              <option value="Beverage">Beverage</option>
              {/* Add more categories as needed */}
            </select>
          </label>
          <label>
            Price ($):
            <input
              type="number"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </label>
          <label>
            Current Image:
            <img src={menuItem.image} alt={menuItem.name} className="current-image" />
          </label>
          <label>
            Change Image:
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
          </label>
          <button type="submit" className="submit-button">
            Update Menu Item
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditMenuItem;
