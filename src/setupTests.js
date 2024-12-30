// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
global.console.warn = jest.fn();
// setupTests.js

// setupTests.js

// Mock console.warn during test execution
beforeAll(() => {
    jest.spyOn(console, 'warn').mockImplementation((message) => {
      if (
        message.includes('React Router Future Flag Warning') ||
        message.includes('Relative route resolution within Splat routes')
      ) {
        // Ignore specific React Router warnings
        return;
      }
      console.warn(message);  // Allow other warnings to be logged
    });
  });
  
  afterAll(() => {
    jest.restoreAllMocks();  // Clean up mocks after tests
  });
  