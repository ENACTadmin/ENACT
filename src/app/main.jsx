import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const container = document.getElementById('app-root');
if (container) {
  createRoot(container).render(<App />);
}
