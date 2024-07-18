import React from 'react';

const TooltipComponent = ({ data }) => {
  if (!data) return null;

  return (
    <div style={{
      position: 'absolute',
      top: `${data.y0}px`,
      left: `${data.x1 + 5}px`,
      background: 'white',
      border: '1px solid black',
      padding: '5px',
      borderRadius: '5px'
    }}>
      <p>{data.name}</p>
      <p>Value: {data.value}</p>
    </div>
  );
};

export default TooltipComponent;