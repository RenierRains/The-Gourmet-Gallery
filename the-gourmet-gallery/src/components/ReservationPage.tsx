import React from 'react';
import ReservationForm from '../components/ReservationForm';
import './ReservationPage.css';

const ReservationPage: React.FC = () => {
  return (
    <div className="reservation-page">
      <ReservationForm />
    </div>
  );
};

export default ReservationPage;