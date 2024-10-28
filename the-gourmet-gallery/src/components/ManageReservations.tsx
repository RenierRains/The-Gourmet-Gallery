import React, { useEffect, useState } from 'react';
import adminService from '../services/adminService';
import './ManageReservations.css';
import { CheckCircle, Trash2, XCircle, Download } from 'lucide-react';
import { saveAs } from 'file-saver'; 

interface Reservation {
  id: number;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  specialRequests?: string;
  status: string;
  User: {
    username: string;
    email: string;
  };
}

interface ManageReservationsProps {
  refreshPendingCount: () => void;
}

const ManageReservations: React.FC<ManageReservationsProps> = ({ refreshPendingCount }) => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [filteredReservations, setFilteredReservations] = useState<Reservation[]>([]); 
  const [loading, setLoading] = useState<boolean>(true);
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string>('');

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const [sortField, setSortField] = useState<string>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const [currentPage, setCurrentPage] = useState<number>(1);
  const reservationsPerPage = 20;

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const data = await adminService.getReservations();
        setReservations(data);
        setFilteredReservations(data);
        setLoading(false);
      } catch (error: any) {
        console.error('Error fetching reservations:', error);
        setError('Failed to load reservations.');
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  useEffect(() => {
    let tempReservations = [...reservations];

    if (searchQuery) {
      tempReservations = tempReservations.filter((res) =>
        res.User.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        res.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
        res.date.includes(searchQuery)
      );
    }

    if (filterStatus !== 'all') {
      tempReservations = tempReservations.filter((res) => res.status === filterStatus);
    }

    tempReservations.sort((a, b) => {
      let fieldA: any;
      let fieldB: any;

      if (sortField === 'User.username') {
        fieldA = a.User.username.toLowerCase();
        fieldB = b.User.username.toLowerCase();
      } else if (sortField === 'date') {
        const dateA = new Date(`${a.date} ${a.time}`);
        const dateB = new Date(`${b.date} ${b.time}`);
        if (dateA < dateB) return sortOrder === 'asc' ? -1 : 1;
        if (dateA > dateB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      } else if (sortField === 'guests') {
        fieldA = a.guests;
        fieldB = b.guests;
      } else {
        fieldA = a[sortField as keyof Reservation];
        fieldB = b[sortField as keyof Reservation];

        if (typeof fieldA === 'string') fieldA = fieldA.toLowerCase();
        if (typeof fieldB === 'string') fieldB = fieldB.toLowerCase();
      }

      if (fieldA < fieldB) return sortOrder === 'asc' ? -1 : 1;
      if (fieldA > fieldB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredReservations(tempReservations);
    setCurrentPage(1); 
  }, [searchQuery, filterStatus, sortField, sortOrder, reservations]);

  const handleUpdateReservationStatus = async (id: number, status: string) => {
    if (window.confirm(`Are you sure you want to set this reservation to '${status}'?`)) {
      try {
        await adminService.updateReservation(id, { status });
  
        setReservations(
          reservations.map((res) =>
            res.id === id ? { ...res, status } : res
          )
        );
        setMessage(`Reservation status updated to '${status}'.`);
  
        refreshPendingCount();
      } catch (error: any) {
        console.error('Error updating reservation:', error);
        setError('Failed to update reservation status.');
      }
    }
  };
  
  const handleDeleteReservation = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this reservation?')) {
      try {
        await adminService.deleteReservation(id);
        setReservations(reservations.filter((res) => res.id !== id));
        setMessage('Reservation deleted successfully.');
  
        refreshPendingCount();
      } catch (error: any) {
        console.error('Error deleting reservation:', error);
        setError('Failed to delete reservation.');
      }
    }
  };

  const handleExport = async (format: 'csv' | 'xlsx') => {
    try {
      const blob = await adminService.exportReservations(format);
      const fileName = `reservations.${format}`;
      saveAs(blob, fileName);
      setMessage(`Reservations exported successfully as ${format.toUpperCase()}.`);
    } catch (error: any) {
      console.error('Error exporting reservations:', error);
      setError('Failed to export reservations.');
    }
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
    setCurrentPage(1);
  };

  const indexOfLastReservation = currentPage * reservationsPerPage;
  const indexOfFirstReservation = indexOfLastReservation - reservationsPerPage;
  const currentReservations = filteredReservations.slice(indexOfFirstReservation, indexOfLastReservation);
  const totalPages = Math.ceil(filteredReservations.length / reservationsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const renderPagination = () => {
    const pageNumbers: number[] = [];

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
    <div className="manage-reservations">
      <h2>Manage Reservations</h2>
      {message && <p className="message">{message}</p>}
      {error && <p className="error-message">{error}</p>}

      <div className="export-buttons">
        <button onClick={() => handleExport('csv')} className="export-button">
          <Download size={16} /> Export CSV
        </button>
        <button onClick={() => handleExport('xlsx')} className="export-button">
          <Download size={16} /> Export XLSX
        </button>
      </div>

      <div className="search-filter-container">
        <input
          type="text"
          placeholder="Search by username, phone, or date"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          className="search-input"
        />
        <select
          value={filterStatus}
          onChange={(e) => {
            setFilterStatus(e.target.value);
            setCurrentPage(1);
          }}
          className="filter-select"
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="completed">Completed</option>
          <option value="canceled">Canceled</option>
        </select>
      </div>

      {loading ? (
        <p className="loading-message">Loading reservations...</p>
      ) : filteredReservations.length > 0 ? (
        <>
          <table className="reservations-table">
            <thead>
              <tr>
                <th onClick={() => handleSort('id')} className="sortable-header">
                  ID {sortField === 'id' && (sortOrder === 'asc' ? '▲' : '▼')}
                </th>
                <th onClick={() => handleSort('User.username')} className="sortable-header">
                  User {sortField === 'User.username' && (sortOrder === 'asc' ? '▲' : '▼')}
                </th>
                <th onClick={() => handleSort('date')} className="sortable-header">
                  Date & Time {sortField === 'date' && (sortOrder === 'asc' ? '▲' : '▼')}
                </th>
                <th onClick={() => handleSort('guests')} className="sortable-header">
                  Guests {sortField === 'guests' && (sortOrder === 'asc' ? '▲' : '▼')}
                </th>
                <th onClick={() => handleSort('phone')} className="sortable-header">
                  Phone {sortField === 'phone' && (sortOrder === 'asc' ? '▲' : '▼')}
                </th>
                <th onClick={() => handleSort('status')} className="sortable-header">
                  Status {sortField === 'status' && (sortOrder === 'asc' ? '▲' : '▼')}
                </th>
                <th>Special Requests</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentReservations.map((res) => (
                <tr key={res.id}>
                  <td>{res.id}</td>
                  <td>{res.User.username}</td>
                  <td>
                    {res.date} at {res.time.slice(0, 5)}
                  </td>
                  <td>{res.guests}</td>
                  <td>{res.phone}</td>
                  <td>
                    <span className={`status-badge ${res.status}`}>
                      {res.status.toUpperCase()}
                    </span>
                  </td>
                  <td>{res.specialRequests || 'N/A'}</td>
                  <td className="actions-cell">
                    {res.status === 'pending' && (
                      <button
                        className="approve-button"
                        onClick={() => handleUpdateReservationStatus(res.id, 'approved')}
                        title="Approve Reservation"
                      >
                        <CheckCircle size={16} />
                      </button>
                    )}
                    {res.status === 'approved' && (
                      <button
                        className="complete-button"
                        onClick={() => handleUpdateReservationStatus(res.id, 'completed')}
                        title="Mark as Completed"
                      >
                        <CheckCircle size={16} />
                      </button>
                    )}
                    {res.status !== 'completed' && (
                      <button
                        className="cancel-button"
                        onClick={() => handleUpdateReservationStatus(res.id, 'canceled')}
                        title="Cancel Reservation"
                      >
                        <XCircle size={16} />
                      </button>
                    )}
                    <button
                      className="delete-button"
                      onClick={() => handleDeleteReservation(res.id)}
                      title="Delete Reservation"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {renderPagination()}
        </>
      ) : (
        <p>No reservations found.</p>
      )}
    </div>
  );

};

export default ManageReservations;
