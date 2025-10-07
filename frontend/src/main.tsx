// ===========================
// Entry Point
// ©AngelaMos | 2025
// ===========================

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import '@/styles/global.scss';

const rootElement = document.getElementById('root');

if (rootElement === null || rootElement === undefined) {
  document.body.innerHTML = `
    <div style="
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100vh;
      background: #000;
      color: #fff;
      font-family: 'Courier New', monospace;
      font-size: 18px;
      text-align: center;
    ">
      <div>
        <h1 style="margin-bottom: 20px;">ERROR: SYSTEM FAILURE</h1>
        <p>Failed to initialize application.</p>
        <p style="margin-top: 20px; font-size: 14px;">Please refresh the page.</p>
      </div>
    </div>
  `;
} else {
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
