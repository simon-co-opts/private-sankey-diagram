import React from 'react';
import ReactDOM from 'react-dom/client';  // Updated import for React 18
import './index.css';
import App from './SankeyApp';
import { Provider } from 'react-redux';
import { store } from './redux/store';

// Create a root for rendering the app
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the app using the root
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
