import React from 'react';
import '../styling/Tooltip.css'; // Ensure this path is correct

const Tooltip = ({ tooltipData, position }) => {
  if (!tooltipData) return null;

  return (
    <div
      className="tooltip"
      style={{ left: position.x, top: position.y, visibility: tooltipData.visible ? 'visible' : 'hidden' }}
    >
      {tooltipData.data.word ? (
        <>
          <strong>Word:</strong> {tooltipData.data.word} <br />
          <strong>Value:</strong> {tooltipData.data.value} <br />
          {tooltipData.data.target && (
            <>
              <strong>Target:</strong> {tooltipData.data.target} <br />
            </>
          )}
        </>
      ) : null}
    </div>
  );
};

export default Tooltip;
