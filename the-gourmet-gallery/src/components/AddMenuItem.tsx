import React, { useState, ChangeEvent, FormEvent } from 'react';
import adminService from '../services/adminService';
import { X } from 'lucide-react';


interface AddMenuItemProps {
  onClose: () => void;
  onAdd: (newItem: any) => void;
}

const AddMenuItem: React.FC<AddMenuItemProps> = ({ onClose, onAdd }) => {
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [image, setImage] = useState<File | null>(null);
  const [error, setError] = useState<string>('');

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !description || !category || !price || !image) {
      setError('All fields are required.');
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('category', category);
    formData.append('price', price);
    formData.append('image', image);

    try {
      const response = await adminService.createMenuItem(formData);
      onAdd(response.menuItem);
    } catch (err: any) {
      console.error('Error adding menu item:', err);
      setError(err.response?.data?.message || 'Failed to add menu item.');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <button className="close-button" onClick={onClose}>
          <X size={20} />
        </button>
        <h3>Add New Menu Item</h3>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit} className="add-menu-item-form">
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
              {/* add */}
            </select>
          </label>
          <label>
            Price (₱):
            <input
              type="number"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </label>
          <label>
            Image:
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              required
            />
          </label>
          <button type="submit" className="submit-button">
            Add Menu Item
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddMenuItem;
