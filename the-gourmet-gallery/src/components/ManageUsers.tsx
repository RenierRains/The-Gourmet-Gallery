import React, { useEffect, useState } from 'react';
import adminService from '../services/adminService';
import './ManageUsers.css';

interface User {
  id: number;
  username: string;
  email: string;
  isAdmin: boolean;
}

const ManageUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await adminService.getUsers();
        setUsers(data);
        setLoading(false);
      } catch (error: any) {
        console.error('Error fetching users:', error);
        setMessage('Failed to load users.');
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleDeleteUser = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await adminService.deleteUser(id);
        setUsers(users.filter((user) => user.id !== id));
        setMessage('User deleted successfully.');
      } catch (error: any) {
        console.error('Error deleting user:', error);
        setMessage('Failed to delete user.');
      }
    }
  };

  return (
    <div className="manage-users">
      <h2>Manage Users</h2>
      {message && <p className="message">{message}</p>}
      {loading ? (
        <p>Loading users...</p>
      ) : users.length > 0 ? (
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
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.isAdmin ? 'Yes' : 'No'}</td>
                <td>
                  {/* Add edit functionality if needed */}
                  <button
                    className="delete-button"
                    onClick={() => handleDeleteUser(user.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No users found.</p>
      )}
    </div>
  );
};

export default ManageUsers;