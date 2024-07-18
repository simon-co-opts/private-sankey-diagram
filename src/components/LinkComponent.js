import React from 'react';
import { sankeyLinkHorizontal } from 'd3-sankey'; // Importing D3 sankey link generator

const LinkComponent = ({ link }) => {
  return (
    <path
      // Use sankeyLinkHorizontal to generate the path 'd' attribute for the link
      d={sankeyLinkHorizontal()(link)}
      style={{
        fill: 'none', // No fill color
        strokeOpacity: 0.2, // Opacity of the stroke
        stroke: '#000', // Stroke color
        strokeWidth: Math.max(1, link.width) // Stroke width based on link width
      }}
    />
  );
};

export default LinkComponent;