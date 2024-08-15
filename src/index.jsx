// Import necessary dependencies from React and ReactDOM libraries
import React from 'react';
import ReactDOM from 'react-dom/client';  // Importing the updated ReactDOM API for React 18

// Import global CSS styles
import './index.css';

// Import the main App component, which contains the logic and structure for rendering the Sankey Diagram
import App from './SankeyApp';

// Import the Provider component from 'react-redux' to connect the Redux store to the React application
import { Provider } from 'react-redux';

// Import the configured Redux store from the project's Redux setup
import { store } from './redux/store';

// Create a root DOM node where the React application will be rendered
// The 'createRoot' function is a new API in React 18, replacing the previous 'ReactDOM.render' method
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the React application into the root DOM node
// The <Provider> component is used to wrap the <App> component, giving it access to the Redux store
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
