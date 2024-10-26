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

  // page state
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

    setFilteredReservations(tempReservations);
    setCurrentPage(1); 
  }, [searchQuery, filterStatus, reservations]);

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

  // export
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

  // pagination
  const indexOfLastReservation = currentPage * reservationsPerPage;
  const indexOfFirstReservation = indexOfLastReservation - reservationsPerPage;
  const currentReservations = filteredReservations.slice(indexOfFirstReservation, indexOfLastReservation);
  const totalPages = Math.ceil(filteredReservations.length / reservationsPerPage);

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
    <div className="manage-reservations">
      <h2>Manage Reservations</h2>
      {message && <p className="message">{message}</p>}
      {error && <p className="error-message">{error}</p>}

      {/* Export Buttons */}
      <div className="export-buttons">
        <button onClick={() => handleExport('csv')} className="export-button">
          <Download size={16} /> Export CSV
        </button>
        <button onClick={() => handleExport('xlsx')} className="export-button">
          <Download size={16} /> Export XLSX
        </button>
      </div>

      {/* Search and Filter Inputs */}
      <div className="search-filter-container">
        <input
          type="text"
          placeholder="Search by username, phone, or date"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
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
                <th>ID</th>
                <th>User</th>
                <th>Date & Time</th>
                <th>Guests</th>
                <th>Phone</th>
                <th>Status</th>
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

          {/* pagination */}
          {renderPagination()}
        </>
      ) : (
        <p>No reservations found.</p>
      )}
    </div>
  );

};

export default ManageReservations;