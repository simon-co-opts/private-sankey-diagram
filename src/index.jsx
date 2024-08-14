import React from 'react';
import ReactDOM from 'react-dom/client';  // Updated import for React 18
import './index.css';
import App from './SankeyApp';
import { Provider } from 'react-redux';
// redux needs to be configured. State needs to be updated so it can be connected to the dashboard.
import { store } from './redux/store';

// This creates a root for rendering the SankeyDiagram
const root = ReactDOM.createRoot(document.getElementById('root'));

// This renders the Sankey using the root
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
