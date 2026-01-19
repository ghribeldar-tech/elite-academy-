import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './style.css'; // استدعاء ملف الـ CSS بما أنه موجود في نفس المجلد

const container = document.getElementById('root');

if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
