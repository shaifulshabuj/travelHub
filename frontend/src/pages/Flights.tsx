import React from 'react';
import FlightSearchComponent from '../components/genetic/FlightSearchComponent';

const Flights: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Search Flights</h1>
        <FlightSearchComponent />
      </div>
    </div>
  );
};

export default Flights;