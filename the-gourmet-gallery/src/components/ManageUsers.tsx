import React, { useEffect, useState } from 'react';
import adminService from '../services/adminService';
import './ManageUsers.css';
import { Trash2 } from 'lucide-react';

interface User {
  id: number;
  username: string;
  email: string;
  isAdmin: boolean;
}

const ManageUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]); 
  const [loading, setLoading] = useState<boolean>(true);
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string>('');

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterAdminStatus, setFilterAdminStatus] = useState<string>('all');

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const usersPerPage = 20;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await adminService.getUsers();
        setUsers(data);
        setFilteredUsers(data);
        setLoading(false);
      } catch (error: any) {
        console.error('Error fetching users:', error);
        setError('Failed to load users.');
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    let tempUsers = [...users];

    if (searchQuery) {
      tempUsers = tempUsers.filter((user) =>
        user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filterAdminStatus !== 'all') {
      const isAdmin = filterAdminStatus === 'admin';
      tempUsers = tempUsers.filter((user) => user.isAdmin === isAdmin);
    }

    setFilteredUsers(tempUsers);
    setCurrentPage(1); 
  }, [searchQuery, filterAdminStatus, users]);

  const handleDeleteUser = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await adminService.deleteUser(id);
        setUsers(users.filter((user) => user.id !== id));
        setMessage('User deleted successfully.');
      } catch (error: any) {
        console.error('Error deleting user:', error);
        setError('Failed to delete user.');
      }
    }
  };

  // pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const renderPagination = () => {
    const pageNumbers: number[] = [];

    // limit
    const maxPageNumbersToShow = 5;
    let startPage = Math.max(currentPage - Math.floor(maxPageNumbersToShow / 2), 1);
    let endPage = startPage + maxPageNumbersToShow - 1;

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(endPage - maxPageNumbersToShow + 1, 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="pagination">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className="pagination-button"
        >
          &laquo; Prev
        </button>
        {startPage > 1 && (
          <>
            <button onClick={() => paginate(1)} className="pagination-button">
              1
            </button>
            {startPage > 2 && <span className="pagination-ellipsis">...</span>}
          </>
        )}
        {pageNumbers.map((number) => (
          <button
            key={number}
            onClick={() => paginate(number)}
            className={`pagination-button ${currentPage === number ? 'active' : ''}`}
          >
            {number}
          </button>
        ))}
        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="pagination-ellipsis">...</span>}
            <button onClick={() => paginate(totalPages)} className="pagination-button">
              {totalPages}
            </button>
          </>
        )}
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="pagination-button"
        >
          Next &raquo;
        </button>
      </div>
    );
  };

  return (
    <div className="manage-users">
      <h2>Manage Users</h2>
      {message && <p className="message">{message}</p>}
      {error && <p className="error-message">{error}</p>}

      {/* Search and Filter Inputs */}
      <div className="search-filter-container">
        <input
          type="text"
          placeholder="Search by username or email"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        <select
          value={filterAdminStatus}
          onChange={(e) => setFilterAdminStatus(e.target.value)}
          className="filter-select"
        >
          <option value="all">All Users</option>
          <option value="admin">Admins</option>
          <option value="non-admin">Non-Admins</option>
        </select>
      </div>

      {loading ? (
        <p className="loading-message">Loading users...</p>
      ) : filteredUsers.length > 0 ? (
        <>
          <table className="users-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Email</th>
                <th>Admin</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.isAdmin ? 'Yes' : 'No'}</td>
                  <td className="actions-cell">
                    <button
                      className="delete-button"
                      onClick={() => handleDeleteUser(user.id)}
                      title="Delete User"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Controls */}
          {renderPagination()}
        </>
      ) : (
        <p>No users found.</p>
      )}
    </div>
  );
};

export default ManageUsers;