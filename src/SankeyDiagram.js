import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { sankey, sankeyLinkHorizontal } from 'd3-sankey';
import TooltipComponent from './components/TooltipComponent';

const SankeyDiagram = ({ data }) => {
  const svgRef = useRef();
  const [tooltipData, setTooltipData] = useState(null);

  useEffect(() => {
    if (!data) return;

    const svg = d3.select(svgRef.current);
    const width = 960;
    const height = 500;

    svg.attr('width', width).attr('height', height);

    const sankeyLayout = sankey()
      .nodeWidth(15)
      .nodePadding(10)
      .extent([[1, 1], [width - 1, height - 6]]);

    const { nodes, links } = sankeyLayout(data);

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    // Use D3's enter-update-exit pattern for smoother updates
    const linkSelection = svg.selectAll('.link')
      .data(links, d => `${d.source.name}-${d.target.name}`);

    linkSelection.exit().remove();

    linkSelection.enter()
      .append('path')
      .attr('class', 'link')
      .merge(linkSelection)
      .attr('d', sankeyLinkHorizontal())
      .style('stroke', d => color(d.source.name))
      .style('stroke-width', d => Math.max(1, d.width))
      .style('opacity', 0.6)
      .on('mouseover', (event, d) => {
        setTooltipData({
          x: event.pageX,
          y: event.pageY,
          name: `${d.source.name} → ${d.target.name}`,
          value: d.value,
        });
      })
      .on('mouseout', () => setTooltipData(null));

    const nodeSelection = svg.selectAll('.node')
      .data(nodes, d => d.name);

    nodeSelection.exit().remove();

    const nodeEnter = nodeSelection.enter()
      .append('g')
      .attr('class', 'node');

    nodeEnter.append('rect');
    nodeEnter.append('text');

    const nodeMerge = nodeEnter.merge(nodeSelection)
      .attr('transform', d => `translate(${d.x0},${d.y0})`);

    nodeMerge.select('rect')
      .attr('height', d => d.y1 - d.y0)
      .attr('width', sankeyLayout.nodeWidth())
      .style('fill', d => color(d.name))
      .style('stroke', '#000')
      .on('mouseover', (event, d) => {
        setTooltipData({
          x: event.pageX,
          y: event.pageY,
          name: d.name,
          value: d.value,
        });
      })
      .on('mouseout', () => setTooltipData(null));

    nodeMerge.select('text')
      .attr('x', d => d.x0 < width / 2 ? 6 + sankeyLayout.nodeWidth() : -6)
      .attr('y', d => (d.y1 - d.y0) / 2)
      .attr('dy', '0.35em')
      .attr('text-anchor', d => d.x0 < width / 2 ? 'start' : 'end')
      .text(d => d.name);

  }, [data]);

  return (
    <div>
      <svg ref={svgRef}></svg>
      {tooltipData && <TooltipComponent data={tooltipData} />}
    </div>
  );
};

export default SankeyDiagram;