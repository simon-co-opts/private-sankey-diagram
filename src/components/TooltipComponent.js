import React from 'react';

const TooltipComponent = ({ data }) => {
  return (
    <div
      style={{
        position: 'absolute',
        backgroundColor: '#fff',
        border: '1px solid #ddd',
        padding: '5px',
        pointerEvents: 'none',
        left: `${data.x0}px`,
        top: `${data.y0}px`
      }}
    >
      <strong>{data.name}</strong>
    </div>
  );
};

export default TooltipComponent;
