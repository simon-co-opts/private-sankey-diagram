import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const NodeComponent = ({ node, setTooltipData }) => {
  const nodeRef = useRef();

  useEffect(() => {
    const nodeElement = d3.select(nodeRef.current);

    nodeElement
      .attr('x', node.x0)
      .attr('y', node.y0)
      .attr('height', node.y1 - node.y0)
      .attr('width', node.x1 - node.x0)
      .style('fill', '#69b3a2')
      .style('stroke', '#000')
      .style('stroke-width', '1.5')
      .call(d3.drag()
        .on('start', () => {
          node.fx = node.x0;
          node.fy = node.y0;
        })
        .on('drag', (event) => {
          node.fx = event.x;
          node.fy = event.y;
          d3.select(nodeRef.current)
            .attr('x', node.fx)
            .attr('y', node.fy);
        })
        .on('end', () => {
          node.fx = null;
          node.fy = null;
        })
      )
      .on('mouseover', () => setTooltipData(node))
      .on('mouseout', () => setTooltipData(null));

  }, [node, setTooltipData]);

  return (
    <rect
      ref={nodeRef}
      className="node"
    >
      <title>{node.name}</title>
    </rect>
  );
};

export default NodeComponent;
