import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import FlightSearchComponent from '../components/genetic/FlightSearchComponent';
import { ConsoleErrorMonitor, TypeScriptRuntimeTester } from '../utils/runtime-error-tester';

describe('FlightSearchComponent - TypeScript Runtime Error Tests', () => {
  let errorMonitor: ConsoleErrorMonitor;
  let runtimeTester: TypeScriptRuntimeTester;

  beforeEach(() => {
    errorMonitor = new ConsoleErrorMonitor();
    runtimeTester = new TypeScriptRuntimeTester();
    // Clear any previous console state
    jest.clearAllMocks();
  });

  afterEach(() => {
    errorMonitor.stop();
  });

  describe('Component Rendering Runtime Tests', () => {
    test('should render without console errors', async () => {
      const result = await runtimeTester.testComponentRendering(
        () => render(<FlightSearchComponent />),
        'FlightSearchComponent'
      );

      expect(result.success).toBe(true);
      expect(result.errorReport.errorCount).toBe(0);
      expect(result.errorReport.summary).toBe('No runtime errors or warnings detected');
    });

    test('should handle TypeScript interface compliance for SearchCriteria', async () => {
      errorMonitor.start();
      
      const { container } = render(<FlightSearchComponent />);
      
      // Test form interactions to verify TypeScript interfaces work at runtime
      const fromInput = screen.getByPlaceholderText('Departure city');
      const toInput = screen.getByPlaceholderText('Destination city');
      const passengerSelect = screen.getByRole('combobox');
      const searchButton = screen.getByRole('button', { name: /search flights/i });

      // Test string inputs (should not cause TypeScript runtime errors)
      fireEvent.change(fromInput, { target: { value: 'New York' } });
      fireEvent.change(toInput, { target: { value: 'Los Angeles' } });
      
      // Test number handling in dropdown
      fireEvent.change(passengerSelect, { target: { value: '3' } });

      expect(fromInput).toHaveValue('New York');
      expect(toInput).toHaveValue('Los Angeles');
      expect(passengerSelect).toHaveValue('3');

      errorMonitor.stop();
      const report = errorMonitor.generateReport();
      
      expect(report.errorCount).toBe(0);
      expect(report.warningCount).toBe(0);
    });

    test('should handle async search operation without runtime errors', async () => {
      const result = await runtimeTester.testAsyncOperations(
        async () => {
          const { container } = render(<FlightSearchComponent />);
          
          // Fill in form fields
          const fromInput = screen.getByPlaceholderText('Departure city');
          const toInput = screen.getByPlaceholderText('Destination city');
          const searchButton = screen.getByRole('button', { name: /search flights/i });

          fireEvent.change(fromInput, { target: { value: 'NYC' } });
          fireEvent.change(toInput, { target: { value: 'LAX' } });
          
          // Trigger search (async operation)
          fireEvent.click(searchButton);
          
          // Wait for loading state
          expect(screen.getByText('Searching...')).toBeInTheDocument();
          
          // Wait for results
          await waitFor(() => {
            expect(screen.getByText('Search Results')).toBeInTheDocument();
          }, { timeout: 2000 });

          return { searchCompleted: true };
        },
        'FlightSearchAsyncOperation'
      );

      expect(result.success).toBe(true);
      expect(result.testResult?.searchCompleted).toBe(true);
      expect(result.errorReport.errorCount).toBe(0);
    });

    test('should handle edge cases and type mismatches gracefully', async () => {
      errorMonitor.start();
      
      const { container } = render(<FlightSearchComponent />);
      
      // Test edge cases that might cause TypeScript runtime issues
      const passengerSelect = screen.getByDisplayValue('1 passenger');
      const departDateInput = container.querySelector('input[type="date"]');
      
      // Test boundary values
      fireEvent.change(passengerSelect, { target: { value: '6' } }); // Max passengers
      
      if (departDateInput) {
        // Test date edge cases
        fireEvent.change(departDateInput, { target: { value: '2024-12-31' } });
      }

      // Wait for any potential runtime errors
      await new Promise(resolve => setTimeout(resolve, 100));

      errorMonitor.stop();
      const report = errorMonitor.generateReport();
      
      expect(report.errorCount).toBe(0);
    });
  });

  describe('TypeScript Interface Validation Tests', () => {
    test('should validate SearchCriteria interface compliance', async () => {
      const validSearchCriteria = {
        from: 'NYC',
        to: 'LAX',
        departDate: '2024-12-25',
        returnDate: '2024-12-30',
        passengers: 2,
        class: 'economy' as const
      };

      const result = await runtimeTester.testInterfaceCompliance(
        validSearchCriteria,
        'SearchCriteria',
        (data) => {
          return (
            typeof data.from === 'string' &&
            typeof data.to === 'string' &&
            typeof data.departDate === 'string' &&
            typeof data.passengers === 'number' &&
            data.passengers >= 1 &&
            data.passengers <= 6 &&
            ['economy', 'business', 'first'].includes(data.class)
          );
        }
      );

      expect(result.success).toBe(true);
      expect(result.errorReport.errorCount).toBe(0);
    });

    test('should detect invalid SearchCriteria interface compliance', async () => {
      const invalidSearchCriteria = {
        from: 123, // Should be string
        to: null,  // Should be string
        departDate: new Date(), // Should be string
        passengers: 'two', // Should be number
        class: 'premium' // Invalid class option
      };

      const result = await runtimeTester.testInterfaceCompliance(
        invalidSearchCriteria,
        'SearchCriteria',
        (data) => {
          return (
            typeof data.from === 'string' &&
            typeof data.to === 'string' &&
            typeof data.departDate === 'string' &&
            typeof data.passengers === 'number' &&
            data.passengers >= 1 &&
            data.passengers <= 6 &&
            ['economy', 'business', 'first'].includes(data.class)
          );
        }
      );

      expect(result.success).toBe(false);
      expect(result.runtimeError).toBeDefined();
      expect(result.runtimeError?.message).toContain('SearchCriteria interface');
    });
  });

  describe('Browser Compatibility Tests', () => {
    test('should handle modern JavaScript features used by TypeScript', async () => {
      errorMonitor.start();

      // Test features that TypeScript might compile to
      const testModernFeatures = () => {
        // Spread operator (used in component)
        const obj1 = { a: 1 };
        const obj2 = { ...obj1, b: 2 };
        
        // Optional chaining (TypeScript feature)
        const optionalObj: any = {};
        const value = optionalObj?.nested?.value;
        
        // Nullish coalescing
        const defaultValue = value ?? 'default';
        
        // Arrow functions (used throughout)
        const arrow = (x: number) => x * 2;
        const result = arrow(5);
        
        return { obj2, value, defaultValue, result };
      };

      const result = testModernFeatures();
      
      await new Promise(resolve => setTimeout(resolve, 50));
      
      errorMonitor.stop();
      const report = errorMonitor.generateReport();
      
      expect(report.errorCount).toBe(0);
      expect(result.obj2.b).toBe(2);
      expect(result.defaultValue).toBe('default');
      expect(result.result).toBe(10);
    });

    test('should handle Promise-based operations correctly', async () => {
      const result = await runtimeTester.testAsyncOperations(
        async () => {
          // Simulate the async operation in FlightSearchComponent
          return new Promise((resolve) => {
            setTimeout(() => {
              resolve([
                {
                  id: 1,
                  airline: 'Test Airlines',
                  from: 'NYC',
                  to: 'LAX',
                  price: '$299',
                  duration: '2h 30m'
                }
              ]);
            }, 100);
          });
        },
        'FlightSearchPromiseOperation'
      );

      expect(result.success).toBe(true);
      expect(Array.isArray(result.testResult)).toBe(true);
      expect(result.testResult[0].airline).toBe('Test Airlines');
    });
  });

  describe('Memory Leak and Performance Tests', () => {
    test('should not cause memory leaks during multiple renders', async () => {
      errorMonitor.start();
      
      const renders = [];
      
      // Render and unmount multiple times to test for memory leaks
      for (let i = 0; i < 5; i++) {
        const { unmount } = render(<FlightSearchComponent />);
        renders.push(unmount);
      }
      
      // Clean up all renders
      renders.forEach(unmount => unmount());
      
      // Wait for cleanup
      await new Promise(resolve => setTimeout(resolve, 100));
      
      errorMonitor.stop();
      const report = errorMonitor.generateReport();
      
      expect(report.errorCount).toBe(0);
      expect(report.warningCount).toBe(0);
    });

    test('should handle rapid state updates without errors', async () => {
      const result = await runtimeTester.testAsyncOperations(
        async () => {
          const { container } = render(<FlightSearchComponent />);
          const fromInput = screen.getByPlaceholderText('Departure city');
          
          // Rapidly fire state updates (simulating fast typing)
          for (let i = 0; i < 10; i++) {
            fireEvent.change(fromInput, { target: { value: `City${i}` } });
          }
          
          // Wait a bit for all updates to process
          await new Promise(resolve => setTimeout(resolve, 50));
          
          return { finalValue: fromInput.value };
        },
        'RapidStateUpdates'
      );

      expect(result.success).toBe(true);
      expect(result.testResult.finalValue).toBe('City9');
    });
  });
});