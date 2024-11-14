import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // Użycie BrowserRouter
import App from './App';
import './index.css'; // Jeśli masz globalne style

const root = ReactDOM.createRoot(document.getElementById('root'));

// BrowserRouter otacza całą aplikację
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);