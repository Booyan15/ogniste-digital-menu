import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './styles.css';

const isInternalImageReview =
  import.meta.env.DEV && window.location.pathname === '/internal/ognishte-image-review';

async function renderApp() {
  // Development-only route: never replaces the customer menu in production.
  const RootComponent = isInternalImageReview
    ? (await import('./components/OgnishteImageReview.jsx')).default
    : App;

  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <RootComponent />
    </React.StrictMode>,
  );
}

renderApp();
