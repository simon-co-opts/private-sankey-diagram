import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3'; // Import D3 library

const NodeComponent = ({ node, setTooltipData, width }) => {
  const nodeRef = useRef(); // Reference to node element

  useEffect(() => {
    const nodeElement = d3.select(nodeRef.current); // Select node element using D3

    // Set initial attributes for node element
    nodeElement
      .attr('x', node.x0) // Initial x position
      .attr('y', node.y0) // Initial y position
      .attr('height', node.y1 - node.y0) // Height based on node data
      .attr('width', node.x1 - node.x0) // Width based on node data
      .call(d3.drag() // Apply D3 drag behavior
        .on('start', () => {
          node.fx = node.x0; // Set fixed x position on drag start
          node.fy = node.y0; // Set fixed y position on drag start
        })
        .on('drag', (event) => {
          node.fx = event.x; // Update fixed x position during drag
          node.fy = event.y; // Update fixed y position during drag
          d3.select(nodeRef.current) // Select node element and update position attributes
            .attr('x', node.fx)
            .attr('y', node.fy);
        })
        .on('end', () => {
          node.fx = null; // Reset fixed x position on drag end
          node.fy = null; // Reset fixed y position on drag end
        })
      )
      .on('mouseover', () => setTooltipData(node)) // Set tooltip data on mouseover
      .on('mouseout', () => setTooltipData(null)); // Clear tooltip data on mouseout

  }, [node, setTooltipData]); // Trigger effect on node or setTooltipData change

  return (
    <rect
      ref={nodeRef} // Attach ref to rect element
      className="node" // CSS class for styling
      fill="#69b3a2" // Fill color of the node
      stroke="#000" // Stroke color of the node
      strokeWidth="1.5" // Stroke width
    >
      <title>{node.name}</title> {/* Tooltip title with node name */}
    </rect>
  );
};

export default NodeComponent;