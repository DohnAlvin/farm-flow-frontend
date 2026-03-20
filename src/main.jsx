import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '@/App.jsx';
import '@/index.css';

/**
 * The Entry Point
 * -----------------
 * We wrap <App /> in StrictMode to help identify unsafe lifecycles,
 * legacy API usage, and other potential bugs during development.
 */
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);