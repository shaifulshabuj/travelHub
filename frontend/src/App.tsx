import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Simple components for testing navigation
const Navigation = () => (
  <nav style={{ padding: '1rem', backgroundColor: '#1e40af', color: 'white' }}>
    <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '2rem' }}>
      <a href="/" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>TravelHub</a>
      <a href="/flights" style={{ color: 'white', textDecoration: 'none' }}>Flights</a>
      <a href="/hotels" style={{ color: 'white', textDecoration: 'none' }}>Hotels</a>
      <a href="/bookings" style={{ color: 'white', textDecoration: 'none' }}>Bookings</a>
      <a href="/about" style={{ color: 'white', textDecoration: 'none' }}>About</a>
      <a href="/contact" style={{ color: 'white', textDecoration: 'none' }}>Contact</a>
    </div>
  </nav>
);

const Home = () => (
  <div style={{ padding: '2rem', textAlign: 'center' }}>
    <h1>Welcome to TravelHub</h1>
    <p>Genetic Travel Platform</p>
    <div style={{ marginTop: '2rem' }}>
      <a href="/flights" style={{ margin: '0 1rem', padding: '0.5rem 1rem', backgroundColor: '#1e40af', color: 'white', textDecoration: 'none', borderRadius: '4px' }}>
        Search Flights
      </a>
      <a href="/hotels" style={{ margin: '0 1rem', padding: '0.5rem 1rem', backgroundColor: '#059669', color: 'white', textDecoration: 'none', borderRadius: '4px' }}>
        Find Hotels
      </a>
    </div>
  </div>
);

const Flights = () => (
  <div style={{ padding: '2rem' }}>
    <h1>Flight Search</h1>
    <p>Search for flights here</p>
    <a href="/" style={{ color: '#1e40af' }}>← Back to Home</a>
  </div>
);

const Hotels = () => (
  <div style={{ padding: '2rem' }}>
    <h1>Hotel Search</h1>
    <p>Find hotels here</p>
    <a href="/" style={{ color: '#1e40af' }}>← Back to Home</a>
  </div>
);

const Bookings = () => (
  <div style={{ padding: '2rem' }}>
    <h1>My Bookings</h1>
    <p>View your booking history here</p>
    <a href="/" style={{ color: '#1e40af' }}>← Back to Home</a>
    <br />
    <a href="/contact" style={{ color: '#1e40af' }}>Need help? Contact us</a>
  </div>
);

const About = () => (
  <div style={{ padding: '2rem' }}>
    <h1>About TravelHub</h1>
    <p>Learn about our genetic coding architecture</p>
    <a href="/" style={{ color: '#1e40af' }}>← Back to Home</a>
    <br />
    <a href="https://github.com/shaifulshabuj/travelHub" target="_blank" rel="noopener noreferrer" style={{ color: '#1e40af' }}>View our GitHub repository</a>
  </div>
);

const Contact = () => (
  <div style={{ padding: '2rem' }}>
    <h1>Contact Us</h1>
    <p>Get in touch with our team</p>
    <a href="/" style={{ color: '#1e40af' }}>← Back to Home</a>
    <br />
    <a href="#footer" style={{ color: '#1e40af' }}>Jump to footer</a>
    
    <div style={{ marginTop: '20rem', padding: '2rem', backgroundColor: '#1f2937', color: 'white' }} id="footer">
      <h3>Footer</h3>
      <p>Contact Information:</p>
      <p>Email: info@travelhub.com</p>
      <p>Phone: +1 (555) 123-4567</p>
      <p>&copy; 2024 TravelHub. All rights reserved.</p>
    </div>
  </div>
);

const NotFound = () => (
  <div style={{ padding: '2rem', textAlign: 'center' }}>
    <h1 style={{ color: '#dc2626', fontSize: '3rem' }}>404</h1>
    <h2>Page Not Found</h2>
    <p>The page you are looking for does not exist.</p>
    <div style={{ marginTop: '2rem' }}>
      <a href="/" style={{ margin: '0 1rem', padding: '0.5rem 1rem', backgroundColor: '#1e40af', color: 'white', textDecoration: 'none', borderRadius: '4px' }}>
        Go Home
      </a>
      <a href="/flights" style={{ margin: '0 1rem', padding: '0.5rem 1rem', backgroundColor: '#059669', color: 'white', textDecoration: 'none', borderRadius: '4px' }}>
        Search Flights
      </a>
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <div>
        <Navigation />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/flights" element={<Flights />} />
            <Route path="/hotels" element={<Hotels />} />
            <Route path="/bookings" element={<Bookings />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;