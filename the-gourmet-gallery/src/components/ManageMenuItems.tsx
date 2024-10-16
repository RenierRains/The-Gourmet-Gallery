import React, { useEffect, useState } from 'react';
import adminService from '../services/adminService';
import { Trash2, Edit, PlusCircle } from 'lucide-react';
import AddMenuItem from './AddMenuItem';
import EditMenuItem from './EditMenuItem';
import './ManageMenuItems.css';

interface MenuItem {
  id: number;
  name: string;
  description: string;
  image: string;
  category: string;
  price: string;
}

const ManageMenuItems: React.FC = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [filteredMenuItems, setFilteredMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [message, setMessage] = useState<string>('');
  
  // Search and filter states
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [currentMenuItem, setCurrentMenuItem] = useState<MenuItem | null>(null);

  useEffect(() => {
    fetchMenuItems();
  }, []);

  useEffect(() => {
    filterMenuItems();
  }, [searchQuery, filterCategory, menuItems]);

  const fetchMenuItems = async () => {
    try {
      const data = await adminService.getMenuItems();
      setMenuItems(data);
      setFilteredMenuItems(data);
      setLoading(false);
    } catch (error: any) {
      console.error('Error fetching menu items:', error);
      setMessage('Failed to load menu items.');
      setLoading(false);
    }
  };

  const filterMenuItems = () => {
    let tempMenuItems = [...menuItems];

    // Filter by search query
    if (searchQuery) {
      tempMenuItems = tempMenuItems.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (filterCategory !== 'all') {
      tempMenuItems = tempMenuItems.filter((item) => item.category === filterCategory);
    }

    setFilteredMenuItems(tempMenuItems);
  };

  const handleDeleteMenuItem = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this menu item?')) {
      try {
        await adminService.deleteMenuItem(id);
        setMenuItems(menuItems.filter((item) => item.id !== id));
        setMessage('Menu item deleted successfully.');
      } catch (error: any) {
        console.error('Error deleting menu item:', error);
        setMessage('Failed to delete menu item.');
      }
    }
  };

  const handleEditMenuItem = (item: MenuItem) => {
    setCurrentMenuItem(item);
    setShowEditModal(true);
  };

  const handleAddMenuItem = (newItem: MenuItem) => {
    setMenuItems([...menuItems, newItem]);
    setShowAddModal(false);
    setMessage('Menu item added successfully.');
  };

  const handleUpdateMenuItem = (updatedItem: MenuItem) => {
    const updatedMenuItems = menuItems.map((item) =>
      item.id === updatedItem.id ? updatedItem : item
    );
    setMenuItems(updatedMenuItems);
    setShowEditModal(false);
    setMessage('Menu item updated successfully.');
  };

  return (
    <div className="manage-menu-items">
      <h2>Manage Menu Items</h2>
      {message && <p className="message">{message}</p>}
      
      {/* Search and Filter */}
      <div className="search-filter-container">
        <input
          type="text"
          placeholder="Search by name or description"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="filter-select"
        >
          <option value="all">All Categories</option>
          <option value="Appetizer">Appetizer</option>
          <option value="Main Course">Main Course</option>
          <option value="Dessert">Dessert</option>
          <option value="Beverage">Beverage</option>
          {/* Add more categories as needed */}
        </select>
        <button className="add-button" onClick={() => setShowAddModal(true)}>
          <PlusCircle size={16} /> Add Menu Item
        </button>
      </div>

      {loading ? (
        <p className="loading-message">Loading menu items...</p>
      ) : filteredMenuItems.length > 0 ? (
        <table className="menu-items-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Description</th>
              <th>Category</th>
              <th>Price ($)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredMenuItems.map((item) => (
              <tr key={item.id}>
                <td>
                  <img src={item.image} alt={item.name} className="menu-item-image" />
                </td>
                <td>{item.name}</td>
                <td>{item.description}</td>
                <td>{item.category}</td>
                <td>{item.price}</td>
                <td className="actions-cell">
                  <button
                    className="edit-button"
                    onClick={() => handleEditMenuItem(item)}
                    title="Edit Menu Item"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    className="delete-button"
                    onClick={() => handleDeleteMenuItem(item.id)}
                    title="Delete Menu Item"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No menu items found.</p>
      )}

      {/* Add Menu Item Modal */}
      {showAddModal && (
        <AddMenuItem
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddMenuItem}
        />
      )}

      {/* Edit Menu Item Modal */}
      {showEditModal && currentMenuItem && (
        <EditMenuItem
          menuItem={currentMenuItem}
          onClose={() => setShowEditModal(false)}
          onUpdate={handleUpdateMenuItem}
        />
      )}
    </div>
  );
};

export default ManageMenuItems;
