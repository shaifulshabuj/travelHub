import '@testing-library/jest-dom';

// Mock window.performance if not available
if (typeof window !== 'undefined' && !window.performance) {
  (window as any).performance = {
    now: jest.fn(() => Date.now()),
  };
}

// Mock global performance if not available
if (typeof performance === 'undefined') {
  (global as any).performance = {
    now: jest.fn(() => Date.now()),
  };
}