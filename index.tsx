
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Removed manual process polyfill to fix TypeScript error and comply with GenAI guidelines.
// The environment variable process.env.API_KEY is assumed to be provided by the execution context.

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
