// src/components/Tooltip.js
import React from 'react';
import '../styling/Tooltip.css'; // Ensure this file contains styling for your tooltip

function Tooltip({ tooltipData, position }) {
  return (
    <div
      className="tooltip"
      style={{ left: position.x, top: position.y, position: 'absolute' }}
    >
      <div><strong>{tooltipData.name}</strong></div>
      <div>Value: {tooltipData.value}</div>
      {tooltipData.target && <div>Target: {tooltipData.target}</div>}
      {tooltipData.session !== undefined && <div>Session: {tooltipData.session}</div>}
    </div>
  );
}

export default Tooltip;
