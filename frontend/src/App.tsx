import React from 'react';
import './App.css';
import FlightSearchComponent from './components/genetic/FlightSearchComponent';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>TravelHub - Genetic Travel Platform</h1>
        <p>Multi-Agent Travel Services with Genetic Coding Architecture</p>
      </header>
      <main>
        <FlightSearchComponent />
      </main>
    </div>
  );
}

export default App;
