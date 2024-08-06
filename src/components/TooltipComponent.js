import React from 'react';

const TooltipComponent = ({ data }) => {
  const style = {
    position: 'absolute',
    left: data.x + 'px',
    top: data.y + 'px',
    backgroundColor: '#fff',
    border: '1px solid #ccc',
    padding: '5px',
    pointerEvents: 'none',
    zIndex: 10,
  };

  return (
    <div style={style}>
      <div><strong>{data.name}</strong></div>
      <div>Value: {data.value}</div>
    </div>
  );
};

export default TooltipComponent;
