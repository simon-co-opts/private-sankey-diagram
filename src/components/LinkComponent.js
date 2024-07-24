import React from 'react';
import { sankeyLinkHorizontal } from 'd3-sankey';

const LinkComponent = ({ link }) => {
  const path = sankeyLinkHorizontal();

  return (
    <path
      d={path(link)}
      style={{
        fill: 'none',
        stroke: '#000',
        strokeOpacity: 0.5,
        strokeWidth: Math.max(1, link.width)
      }}
    />
  );
};

export default LinkComponent;
