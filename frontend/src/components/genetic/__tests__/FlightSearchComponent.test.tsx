import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import FlightSearchComponent from '../FlightSearchComponent';

// Mock window.matchMedia for responsive design tests
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

describe('FlightSearchComponent Mobile Responsiveness', () => {
  const renderComponent = () => render(<FlightSearchComponent />);

  test('renders search form with all required fields', () => {
    renderComponent();
    expect(screen.getByRole('heading', { name: 'Search Flights' })).toBeInTheDocument();
    expect(screen.getByLabelText('From')).toBeInTheDocument();
    expect(screen.getByLabelText('To')).toBeInTheDocument();
    expect(screen.getByLabelText('Departure Date')).toBeInTheDocument();
    expect(screen.getByLabelText('Return Date')).toBeInTheDocument();
    expect(screen.getByLabelText('Passengers')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /search flights/i })).toBeInTheDocument();
  });

  test('form inputs have proper mobile-friendly attributes', () => {
    renderComponent();
    const fromInput = screen.getByPlaceholderText('Departure city');
    const toInput = screen.getByPlaceholderText('Destination city');
    
    // Check for larger touch targets (padding)
    expect(fromInput).toHaveClass('p-3');
    expect(toInput).toHaveClass('p-3');
    
    // Check for proper input types
    expect(fromInput).toHaveAttribute('type', 'text');
    expect(toInput).toHaveAttribute('type', 'text');
    
    // Check for placeholders
    expect(fromInput).toHaveAttribute('placeholder', 'Departure city');
    expect(toInput).toHaveAttribute('placeholder', 'Destination city');
  });

  test('search button is disabled when required fields are empty', () => {
    renderComponent();
    const searchButton = screen.getByRole('button', { name: /search flights/i });
    expect(searchButton).toBeDisabled();
  });

  test('search button is enabled when from and to fields are filled', () => {
    renderComponent();
    const fromInput = screen.getByPlaceholderText('Departure city');
    const toInput = screen.getByPlaceholderText('Destination city');
    const searchButton = screen.getByRole('button', { name: /search flights/i });

    fireEvent.change(fromInput, { target: { value: 'New York' } });
    fireEvent.change(toInput, { target: { value: 'Los Angeles' } });

    expect(searchButton).not.toBeDisabled();
  });

  test('displays search results after search', async () => {
    renderComponent();
    const fromInput = screen.getByPlaceholderText('Departure city');
    const toInput = screen.getByPlaceholderText('Destination city');
    const searchButton = screen.getByRole('button', { name: /search flights/i });

    fireEvent.change(fromInput, { target: { value: 'New York' } });
    fireEvent.change(toInput, { target: { value: 'Los Angeles' } });
    
    // Wait for button to be enabled
    await waitFor(() => {
      expect(searchButton).not.toBeDisabled();
    });
    
    fireEvent.click(searchButton);

    // Wait for search results to appear (longer timeout for simulation)
    await waitFor(() => {
      expect(screen.getByText('Search Results')).toBeInTheDocument();
    }, { timeout: 2000 });

    expect(screen.getByText('TravelHub Airlines')).toBeInTheDocument();
    expect(screen.getByText('New York → Los Angeles')).toBeInTheDocument();
    expect(screen.getByText('$299')).toBeInTheDocument();
  });

  test('search results have mobile-friendly layout', async () => {
    renderComponent();
    const fromInput = screen.getByPlaceholderText('Departure city');
    const toInput = screen.getByPlaceholderText('Destination city');
    const searchButton = screen.getByRole('button', { name: /search flights/i });

    fireEvent.change(fromInput, { target: { value: 'New York' } });
    fireEvent.change(toInput, { target: { value: 'Los Angeles' } });
    
    // Wait for button to be enabled
    await waitFor(() => {
      expect(searchButton).not.toBeDisabled();
    });
    
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(screen.getByText('Search Results')).toBeInTheDocument();
    }, { timeout: 2000 });

    // Check for responsive select button
    const selectButton = screen.getByRole('button', { name: /select/i });
    expect(selectButton).toHaveClass('px-4', 'py-2');
  });

  test('form layout renders with proper structure', () => {
    renderComponent();
    // Test that all form elements are present and accessible
    expect(screen.getByRole('heading', { name: 'Search Flights' })).toBeInTheDocument();
    expect(screen.getByLabelText('From')).toBeInTheDocument();
    expect(screen.getByLabelText('To')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /search flights/i })).toBeInTheDocument();
  });

  test('button has full width on mobile', () => {
    renderComponent();
    const fromInput = screen.getByPlaceholderText('Departure city');
    const toInput = screen.getByPlaceholderText('Destination city');
    
    fireEvent.change(fromInput, { target: { value: 'New York' } });
    fireEvent.change(toInput, { target: { value: 'Los Angeles' } });

    const searchButton = screen.getByRole('button', { name: /search flights/i });
    expect(searchButton).toHaveClass('w-full', 'sm:w-auto');
  });
});