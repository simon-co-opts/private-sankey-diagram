// src/components/Tooltip.js

// Import necessary dependencies from React
import React from 'react';

// Import the CSS file that contains styling specific to the tooltip
import '../styling/Tooltip.css'; // Ensure this file exists and is correctly styled for the tooltip

// Tooltip component: A functional component that renders a tooltip on the screen
// It receives two props:
// 1. `tooltipData`: An object containing data to be displayed within the tooltip (e.g., name, value, target, session)
// 2. `position`: An object containing the x and y coordinates for positioning the tooltip on the screen

function Tooltip({ tooltipData, position }) {
  return (
    // The outermost div acts as the tooltip container
    // The inline style positions the tooltip absolutely based on the x and y coordinates passed via the `position` prop
    <div
      className="tooltip" // Apply styles from Tooltip.css using the class "tooltip"
      style={{ left: position.x, top: position.y, position: 'absolute' }} // Positioning the tooltip
    >
      {/* Render the name from tooltipData in bold */}
      <div><strong>{tooltipData.name}</strong></div>

      {/* Render the value from tooltipData */}
      <div>Value: {tooltipData.value}</div>

      {/* Conditionally render the target from tooltipData if it exists */}
      {tooltipData.target && <div>Target: {tooltipData.target}</div>}

      {/* Conditionally render the session from tooltipData if it is defined */}
      {tooltipData.session !== undefined && <div>Session: {tooltipData.session}</div>}
    </div>
  );
}

// Export the Tooltip component for use in other parts of the application
export default Tooltip;
