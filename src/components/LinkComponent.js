import React from 'react';
import { sankeyLinkHorizontal } from 'd3-sankey';

const LinkComponent = ({ link }) => {
  return (
    <path
      d={sankeyLinkHorizontal()(link)}
      style={{
        fill: 'none',
        strokeOpacity: 0.2,
        stroke: '#000',
        strokeWidth: Math.max(1, link.width)
      }}
    />
  );
};

export default LinkComponent;
