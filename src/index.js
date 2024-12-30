// index.js

// Import statements should come first
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Suppress React Router future warnings before rendering the app
if (process.env.NODE_ENV === 'development') {
  const originalWarn = console.warn;
  console.warn = (message) => {
    if (
      !message.includes('React Router Future Flag Warning') && 
      !message.includes('React Router will begin wrapping state updates')
    ) {
      originalWarn(message);
    }
  };
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
