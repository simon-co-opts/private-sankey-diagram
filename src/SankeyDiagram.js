import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { sankey, sankeyLinkHorizontal } from 'd3-sankey';
import TooltipComponent from './components/TooltipComponent';
import FilterComponent from './components/FilterComponent';

const SankeyDiagram = ({ data }) => {
  const svgRef = useRef();
  const [filteredData, setFilteredData] = useState(data);
  const [tooltipData, setTooltipData] = useState(null);

  useEffect(() => {
    if (!filteredData) return;

    const svg = d3.select(svgRef.current);
    const width = 960;
    const height = 500;

    svg.attr('width', width).attr('height', height);

    const sankeyLayout = sankey()
      .nodeWidth(15)
      .nodePadding(10)
      .extent([[1, 1], [width - 1, height - 6]]);

    const { nodes, links } = sankeyLayout(filteredData);

    svg.selectAll('*').remove();

    // Render Links
    svg.append('g')
      .selectAll('path')
      .data(links)
      .enter()
      .append('path')
      .attr('d', d => sankeyLinkHorizontal()(d)) // Use sankeyLinkHorizontal() to generate the path 'd' attribute
      .style('fill', 'none')
      .style('stroke', '#000')
      .style('opacity', 0.2);

    // Render Nodes
    svg.append('g')
      .selectAll('rect')
      .data(nodes)
      .enter()
      .append('rect')
      .attr('x', d => d.x0)
      .attr('y', d => d.y0)
      .attr('width', d => d.x1 - d.x0)
      .attr('height', d => d.y1 - d.y0)
      .attr('fill', '#69b3a2')
      .attr('stroke', '#000')
      .attr('stroke-width', '1.5')
      .on('mouseover', d => setTooltipData(d)) // Set tooltip data on mouseover
      .on('mouseout', () => setTooltipData(null)); // Clear tooltip data on mouseout

    // Render Labels
    svg.append('g')
      .attr('font-family', 'sans-serif')
      .attr('font-size', 10)
      .selectAll('text')
      .data(nodes)
      .join('text')
      .attr('x', d => (d.x0 < width / 2 ? d.x1 + 6 : d.x0 - 6))
      .attr('y', d => (d.y1 + d.y0) / 2)
      .attr('dy', '0.35em')
      .attr('text-anchor', d => (d.x0 < width / 2 ? 'start' : 'end'))
      .text(d => d.name);

  }, [filteredData]);

  return (
    <div>
      <FilterComponent data={data} setFilteredData={setFilteredData} />
      <svg ref={svgRef}></svg>
      {tooltipData && <TooltipComponent data={tooltipData} />}
    </div>
  );
};

export default SankeyDiagram;
