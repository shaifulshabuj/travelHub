import React, { useState } from 'react';

interface Booking {
  id: string;
  type: 'flight' | 'hotel';
  title: string;
  date: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  details: string;
  price: string;
}

const BookingHistory: React.FC = () => {
  const [bookings] = useState<Booking[]>([
    {
      id: 'FL001',
      type: 'flight',
      title: 'New York to London',
      date: '2024-07-15',
      status: 'confirmed',
      details: 'British Airways BA117 - Departure: 8:30 PM',
      price: '$599'
    },
    {
      id: 'HT001',
      type: 'hotel',
      title: 'Grand Plaza Hotel',
      date: '2024-07-16',
      status: 'confirmed',
      details: '3 nights - Deluxe Room with City View',
      price: '$450'
    },
    {
      id: 'FL002',
      type: 'flight',
      title: 'London to Paris',
      date: '2024-07-20',
      status: 'pending',
      details: 'Air France AF1234 - Departure: 2:15 PM',
      price: '$180'
    }
  ]);

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      confirmed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusClasses[status as keyof typeof statusClasses]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getTypeIcon = (type: string) => {
    if (type === 'flight') {
      return (
        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
        </svg>
      );
    }
    
    return (
      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m0 0h2M7 7h10M7 11h10M7 15h10" />
      </svg>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Bookings</h1>
          <p className="text-gray-600">Manage your travel reservations and booking history</p>
        </div>

        {bookings.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings yet</h3>
            <p className="text-gray-600 mb-6">Start planning your next adventure!</p>
            <div className="space-x-4">
              <a 
                href="/flights" 
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Book a Flight
              </a>
              <a 
                href="/hotels" 
                className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors"
              >
                Book a Hotel
              </a>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div key={booking.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 mt-1">
                      {getTypeIcon(booking.type)}
                    </div>
                    <div className="flex-grow">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{booking.title}</h3>
                        {getStatusBadge(booking.status)}
                      </div>
                      <p className="text-gray-600 mb-1">{booking.details}</p>
                      <p className="text-sm text-gray-500">Booking ID: {booking.id}</p>
                      <p className="text-sm text-gray-500">Date: {new Date(booking.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-gray-900 mb-2">{booking.price}</p>
                    <div className="space-y-2">
                      <button className="block w-full bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 transition-colors">
                        View Details
                      </button>
                      {booking.status === 'confirmed' && (
                        <button className="block w-full bg-gray-100 text-gray-700 px-4 py-2 rounded text-sm hover:bg-gray-200 transition-colors">
                          Cancel Booking
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingHistory;