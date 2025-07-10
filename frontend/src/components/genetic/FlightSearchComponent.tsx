import React, { useState } from 'react';

interface SearchCriteria {
  from: string;
  to: string;
  departDate: string;
  returnDate?: string;
  passengers: number;
  class: 'economy' | 'business' | 'first';
}

/**
 * Flight Search Component - Simplified Version
 * 
 * This is a basic implementation for testing the frontend setup.
 * The genetic evolution features will be added later.
 */
const FlightSearchComponent: React.FC = () => {
  const [searchCriteria, setSearchCriteria] = useState<SearchCriteria>({
    from: '',
    to: '',
    departDate: '',
    returnDate: '',
    passengers: 1,
    class: 'economy'
  });

  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setSearchResults([
        {
          id: 1,
          airline: 'TravelHub Airlines',
          from: searchCriteria.from,
          to: searchCriteria.to,
          price: '$299',
          duration: '2h 30m'
        }
      ]);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="flight-search-container p-4 sm:p-6 max-w-4xl mx-auto">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Search Flights</h2>
      
      <div className="search-form bg-gray-100 p-4 sm:p-6 rounded-lg mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="from-input" className="block text-sm font-medium mb-2">From</label>
            <input
              id="from-input"
              type="text"
              value={searchCriteria.from}
              onChange={(e) => setSearchCriteria({...searchCriteria, from: e.target.value})}
              className="w-full p-3 border rounded-md text-base"
              placeholder="Departure city"
            />
          </div>
          <div>
            <label htmlFor="to-input" className="block text-sm font-medium mb-2">To</label>
            <input
              id="to-input"
              type="text"
              value={searchCriteria.to}
              onChange={(e) => setSearchCriteria({...searchCriteria, to: e.target.value})}
              className="w-full p-3 border rounded-md text-base"
              placeholder="Destination city"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div>
            <label htmlFor="departure-date" className="block text-sm font-medium mb-2">Departure Date</label>
            <input
              id="departure-date"
              type="date"
              value={searchCriteria.departDate}
              onChange={(e) => setSearchCriteria({...searchCriteria, departDate: e.target.value})}
              className="w-full p-3 border rounded-md text-base"
            />
          </div>
          <div>
            <label htmlFor="return-date" className="block text-sm font-medium mb-2">Return Date</label>
            <input
              id="return-date"
              type="date"
              value={searchCriteria.returnDate}
              onChange={(e) => setSearchCriteria({...searchCriteria, returnDate: e.target.value})}
              className="w-full p-3 border rounded-md text-base"
            />
          </div>
          <div className="sm:col-span-2 lg:col-span-1">
            <label htmlFor="passengers" className="block text-sm font-medium mb-2">Passengers</label>
            <select
              id="passengers"
              value={searchCriteria.passengers}
              onChange={(e) => setSearchCriteria({...searchCriteria, passengers: parseInt(e.target.value)})}
              className="w-full p-3 border rounded-md text-base"
            >
              {[1,2,3,4,5,6].map(num => (
                <option key={num} value={num}>{num} passenger{num > 1 ? 's' : ''}</option>
              ))}
            </select>
          </div>
        </div>
        
        <button
          onClick={handleSearch}
          disabled={isLoading || !searchCriteria.from || !searchCriteria.to}
          className="w-full sm:w-auto bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 disabled:opacity-50 font-medium text-base"
        >
          {isLoading ? 'Searching...' : 'Search Flights'}
        </button>
      </div>

      {searchResults.length > 0 && (
        <div className="search-results">
          <h3 className="text-lg sm:text-xl font-semibold mb-4">Search Results</h3>
          {searchResults.map(flight => (
            <div key={flight.id} className="flight-card bg-white border p-4 rounded-lg mb-4">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div className="flex-1">
                  <h4 className="font-semibold text-base sm:text-lg">{flight.airline}</h4>
                  <p className="text-sm sm:text-base">{flight.from} → {flight.to}</p>
                  <p className="text-sm text-gray-600">Duration: {flight.duration}</p>
                </div>
                <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 sm:gap-0">
                  <p className="text-xl sm:text-2xl font-bold text-green-600">{flight.price}</p>
                  <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 text-sm sm:text-base">
                    Select
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {searchResults.length === 0 && !isLoading && (
        <div className="text-center text-gray-500">
          <p>Enter your travel details and click "Search Flights" to find available options.</p>
        </div>
      )}
    </div>
  );
};

export default FlightSearchComponent;