import React from 'react';
import ReservationForm from '../components/ReservationForm';
import './ReservationPage.css';

const ReservationPage: React.FC = () => {
  return (
    <main>
    <div className="reservation-page">
      <ReservationForm />
    </div>
    </main>
  );
};

export default ReservationPage;