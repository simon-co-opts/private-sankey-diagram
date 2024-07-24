import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import { sankey, sankeyLinkHorizontal } from 'd3-sankey';
import TooltipComponent from './components/TooltipComponent'; // Ensure correct import path

const convertDataForSankey = (data) => {
  const nodeMap = new Map();
  data.nodes.forEach((node, index) => {
    nodeMap.set(node.id, index);
  });

  const links = data.links.map(link => ({
    source: nodeMap.get(link.source),
    target: nodeMap.get(link.target),
    value: link.value
  }));

  const nodes = data.nodes.map(node => ({
    id: node.id,
    name: node.name,
    value: node.value || 0
  }));

  return { nodes, links };
};

const filterData = (data, selectedSession, topWords) => {
  if (!Array.isArray(data.nodes)) {
    console.error('Data nodes should be an array');
    return { nodes: [], links: [] };
  }

  if (!selectedSession) return data;

  // Filter data based on selected session
  const sessionData = data.nodes.find(d => d.name === selectedSession);
  if (!sessionData) {
    console.warn(`Session ${selectedSession} not found in data`);
    return { nodes: [], links: [] };
  }

  const filteredNodes = Object.entries(sessionData.wordFrequencies || {})
    .sort(([, a], [, b]) => b - a)
    .slice(0, topWords)
    .map(([name, value]) => ({ name, value }));

  const nodes = filteredNodes.map(node => ({
    id: node.name,
    name: node.name,
    value: node.value || 0
  }));

  const links = filteredNodes.map((node, index) => ({
    source: index > 0 ? filteredNodes[index - 1].name : node.name,
    target: node.name,
    value: node.value
  }));

  return { nodes, links };
};

const SankeyDiagram = ({ data, selectedSession, topWords }) => {
  const svgRef = useRef();
  const [tooltipData, setTooltipData] = useState(null);

  useEffect(() => {
    if (!data || !data.nodes) {
      console.error('Invalid data format:', data);
      return;
    }
  
    const filteredData = filterData(data, selectedSession, topWords);
    const svg = d3.select(svgRef.current);
    const width = 960;
    const height = 500;
  
    svg.attr('width', width).attr('height', height);
  
    const sankeyLayout = sankey()
      .nodeWidth(15)
      .nodePadding(10)
      .extent([[1, 1], [width - 1, height - 6]]);
  
    try {
      // Convert and prepare the data for D3 Sankey layout
      const formattedData = convertDataForSankey(filteredData);
      const { nodes, links } = sankeyLayout({
        nodes: formattedData.nodes.map(d => ({ ...d })),
        links: formattedData.links.map(d => ({ ...d }))
      });
  
      // Clear previous elements
      svg.selectAll('*').remove();
  
      const color = d3.scaleOrdinal(d3.schemeCategory10);
  
      // Create and update links
      svg.selectAll('.link')
        .data(links)
        .enter()
        .append('path')
        .attr('class', 'link')
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
  
      // Create and update nodes
      const nodeSelection = svg.selectAll('.node')
        .data(nodes)
        .enter()
        .append('g')
        .attr('class', 'node')
        .attr('transform', d => `translate(${d.x0},${d.y0})`);
  
      nodeSelection.append('rect')
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
  
      nodeSelection.append('text')
        .attr('x', d => d.x0 < width / 2 ? 6 + sankeyLayout.nodeWidth() : -6)
        .attr('y', d => (d.y1 - d.y0) / 2)
        .attr('dy', '0.35em')
        .attr('text-anchor', d => d.x0 < width / 2 ? 'start' : 'end')
        .text(d => d.name);
  
    } catch (error) {
      console.error('Error rendering Sankey diagram:', error.message);
      console.error(error.stack);
    }
  }, [data, selectedSession, topWords]);
  

  return (
    <>
      <svg ref={svgRef}></svg>
      {tooltipData && <TooltipComponent data={tooltipData} />}
    </>
  );
};

export default SankeyDiagram;
