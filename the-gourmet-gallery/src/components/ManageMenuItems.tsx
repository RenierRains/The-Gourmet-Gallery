import React, { useEffect, useState } from 'react';
import adminService from '../services/adminService';
import { Trash2, Edit, PlusCircle, ChevronLeft, ChevronRight } from 'lucide-react';
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

  // Pagination states
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10; // Number of items per page

  const [sortField, setSortField] = useState<string>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    fetchMenuItems();
  }, []);

  useEffect(() => {
    filterMenuItems();
  }, [searchQuery, filterCategory, menuItems, currentPage, sortField, sortOrder]);

  const fetchMenuItems = async () => {
    try {
      const data = await adminService.getMenuItems();
      setMenuItems(data);
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

    // filter by category
    if (filterCategory !== 'all') {
      tempMenuItems = tempMenuItems.filter((item) => item.category === filterCategory);
    }

    // sort the items
    tempMenuItems.sort((a, b) => {
      let fieldA = a[sortField as keyof MenuItem];
      let fieldB = b[sortField as keyof MenuItem];
    
      // Handle numeric sorting for price field
      if (sortField === 'price') {
        const numA = parseFloat(fieldA as string);
        const numB = parseFloat(fieldB as string);
    
        if (numA < numB) return sortOrder === 'asc' ? -1 : 1;
        if (numA > numB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      } else {
        // Convert strings to lowercase for case-insensitive comparison
        if (typeof fieldA === 'string') fieldA = fieldA.toLowerCase();
        if (typeof fieldB === 'string') fieldB = fieldB.toLowerCase();
    
        if (fieldA < fieldB) return sortOrder === 'asc' ? -1 : 1;
        if (fieldA > fieldB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      }
    });


    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const paginatedItems = tempMenuItems.slice(indexOfFirstItem, indexOfLastItem);

    setFilteredMenuItems(paginatedItems);
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

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
    setCurrentPage(1); // Reset to first page on sort
  };

  const totalPages = Math.ceil(
    menuItems.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        filterCategory === 'all' || item.category === filterCategory;

      return matchesSearch && matchesCategory;
    }).length / itemsPerPage
  );

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
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
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1); 
          }}
          className="search-input"
        />
        <select
          value={filterCategory}
          onChange={(e) => {
            setFilterCategory(e.target.value);
            setCurrentPage(1); 
          }}
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
        <>
          <table className="menu-items-table">
            <thead>
              <tr>
                <th>Image</th>
                <th onClick={() => handleSort('name')} className="sortable-header">
                  Name {sortField === 'name' && (sortOrder === 'asc' ? '▲' : '▼')}
                </th>
                <th onClick={() => handleSort('description')} className="sortable-header">
                  Description {sortField === 'description' && (sortOrder === 'asc' ? '▲' : '▼')}
                </th>
                <th onClick={() => handleSort('category')} className="sortable-header">
                  Category {sortField === 'category' && (sortOrder === 'asc' ? '▲' : '▼')}
                </th>
                <th onClick={() => handleSort('price')} className="sortable-header">
                  Price ($) {sortField === 'price' && (sortOrder === 'asc' ? '▲' : '▼')}
                </th>
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

          {/* Pagination Controls */}
          <div className="pagination">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="pagination-button"
            >
              <ChevronLeft size={16} /> Prev
            </button>

            {/* Page Numbers */}
            {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
              <button
                key={pageNumber}
                onClick={() => handlePageChange(pageNumber)}
                className={`pagination-button ${currentPage === pageNumber ? 'active' : ''}`}
              >
                {pageNumber}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="pagination-button"
            >
              Next <ChevronRight size={16} />
            </button>
          </div>
        </>
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
