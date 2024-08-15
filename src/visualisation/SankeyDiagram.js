import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import { sankey as d3Sankey, sankeyLinkHorizontal } from 'd3-sankey';
import Tooltip from '../components/Tooltip';
import '../styling/Tooltip.css';

// Color schema mapping each session to a specific color.
const colorSchema = d3.scaleOrdinal()
  .domain([1, 2, 3, 4])
  .range(['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728']);

// Transform session data into a format suitable for D3's Sankey layout.
function transformDataToSankeyFormat(sessions, topWords) {
  const nodes = []; // Array to hold node data.
  const links = []; // Array to hold link data.
  const nodeMap = {}; // Map to quickly lookup node index by ID.
  const sessionWidth = 100; // Width of each session's column.
  const nodePadding = 10; // Padding between nodes.

  // Iterate over each session to create nodes for the top words.
  sessions.forEach((session, sessionIndex) => {
    const topWordsList = session.wordFrequencies.slice(0, topWords).map((w, i) => ({
      name: w.word,
      index: i,
      value: w.value
    }));

    // Add each word as a node if not already added.
    topWordsList.forEach((item) => {
      const nodeId = `${sessionIndex + 1}-${item.name}`; // Unique ID for each node.
      if (!nodeMap[nodeId]) {
        nodes.push({
          id: nodeId,
          name: item.name,
          session: sessionIndex + 1,
          index: item.index,
          value: item.value,
          color: colorSchema(sessionIndex + 1), // Color based on session.
          x0: sessionIndex * (sessionWidth + nodePadding), // X position of the node.
          x1: sessionIndex * (sessionWidth + nodePadding) + sessionWidth // X position + width of the node.
        });
        nodeMap[nodeId] = nodes.length - 1; // Map node ID to its index.
      }
    });
  });

  // Create links between nodes of consecutive sessions.
  for (let i = 0; i < sessions.length - 1; ++i) {
    const currentSessionWords = new Set(sessions[i].wordFrequencies.slice(0, topWords).map(w => w.word));
    const nextSessionWords = sessions[i + 1].wordFrequencies.slice(0, topWords).map(w => w.word);

    // Link words present in both sessions.
    currentSessionWords.forEach(word => {
      const currentNodeId = `${i + 1}-${word}`;
      if (nextSessionWords.includes(word)) {
        const nextNodeId = `${i + 2}-${word}`;
        links.push({
          source: nodeMap[currentNodeId],
          target: nodeMap[nextNodeId],
          value: Math.min(
            sessions[i].wordFrequencies.find(w => w.word === word)?.value || 0,
            sessions[i + 1].wordFrequencies.find(w => w.word === word)?.value || 0
          )
        });
      } else {
        // Handle nodes not used in the next session.
        const infrequentlyUsedNodeId = `${i + 2}-infrequently used`;
        if (!nodeMap[infrequentlyUsedNodeId]) {
          nodes.push({
            id: infrequentlyUsedNodeId,
            name: 'infrequently used',
            session: i + 2,
            index: topWords + 1,
            value: 25,
            color: colorSchema(i + 2),
            x0: (i + 1) * (sessionWidth + nodePadding),
            x1: (i + 1) * (sessionWidth + nodePadding) + sessionWidth
          });
          nodeMap[infrequentlyUsedNodeId] = nodes.length - 1;
        }
        links.push({
          source: nodeMap[currentNodeId],
          target: nodeMap[infrequentlyUsedNodeId],
          value: 1
        });
      }
    });

    // Handle words in the next session not present in the current session.
    nextSessionWords.forEach(word => {
      if (!currentSessionWords.has(word)) {
        const notUsedNodeId = `${i + 1}-not used`;
        if (!nodeMap[notUsedNodeId]) {
          nodes.push({
            id: notUsedNodeId,
            name: 'not used',
            session: i + 1,
            index: topWords + 2,
            value: 30,
            color: colorSchema(i + 2),
            x0: (i + 1) * (sessionWidth + nodePadding),
            x1: (i + 1) * (sessionWidth + nodePadding) + sessionWidth
          });
          nodeMap[notUsedNodeId] = nodes.length - 1;
        }
        // Link from previous session node to the "not used" node.
        const sourceNodeId = `${i + 1}-${word}`;
        if (nodeMap[sourceNodeId] !== undefined) {
          links.push({
            source: nodeMap[sourceNodeId],
            target: nodeMap[notUsedNodeId],
            value: 1
          });
        }
      }
    });
  }

  return { nodes, links }; // Return the formatted nodes and links.
}

// Main SankeyDiagram component to render the Sankey diagram.
function SankeyDiagram({ sessions, topWords }) {
  const svgRef = useRef(); // Reference to the SVG element.
  const [tooltipData, setTooltipData] = useState(null); // State to manage tooltip visibility and position.

  useEffect(() => {
    // Transform the session data to a format suitable for D3's Sankey layout.
    const sankeyData = transformDataToSankeyFormat(sessions, topWords);

    if (!sankeyData || !sankeyData.nodes || !sankeyData.links) {
      console.warn('Invalid data structure:', sankeyData);
      return;
    }

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Clear any existing contents in the SVG.

    const width = 1000; // Width of the SVG.
    const height = 800; // Height of the SVG.

    // Configure the Sankey layout.
    const sankey = d3Sankey()
      .nodeWidth(15)
      .nodePadding(10)
      .extent([[10, 10], [width - 10, height - 10]]) // Define the extent of the Sankey diagram.
      .nodeSort(null); // Disable automatic node sorting.

    // Apply the Sankey layout to the nodes and links.
    const { nodes, links } = sankey({
      nodes: sankeyData.nodes.map(d => ({ ...d })), // Clone nodes.
      links: sankeyData.links.map(d => ({ ...d }))  // Clone links.
    });

    svg.attr('viewBox', [0, 0, width, height])
      .style('padding', '20px'); // Add padding around the SVG.

    // Define gradients for links.
    const defs = svg.append('defs');
    defs.selectAll('linearGradient')
      .data(links)
      .enter().append('linearGradient')
      .attr('id', (d, i) => `gradient-${i}`)
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '100%')
      .attr('y2', '0%')
      .each(function(d) {
        d3.select(this)
          .append('stop')
          .attr('offset', '0%')
          .attr('stop-color', nodes[d.source.index].color)
          .attr('stop-opacity', 0.7);
        
        d3.select(this)
          .append('stop')
          .attr('offset', '100%')
          .attr('stop-color', nodes[d.target.index].color)
          .attr('stop-opacity', 0.7);
      });

    // Draw links (paths) in the Sankey diagram.
    svg.append('g')
      .attr('fill', 'none')
      .selectAll('path')
      .data(links)
      .join('path')
      .attr('d', sankeyLinkHorizontal()) // Draw the path for each link.
      .attr('stroke', d => `url(#gradient-${links.indexOf(d)})`) // Apply gradient color to the link.
      .attr('stroke-width', d => Math.max(1, d.width)) // Set the link width.
      .attr('fill', 'none')
      .attr('stroke-opacity', 0.7) // Default opacity for links.
      .on('mouseover', (event, d) => {
        d3.select(event.currentTarget)
          .attr('stroke-opacity', 1) // Make the link fully opaque on hover.
        
        const sourceNode = nodes[d.source.index];
        const targetNode = nodes[d.target.index];
        const tooltipWidth = 200; // Width of the tooltip.
        const xPosition = event.pageX; // Current mouse x position.
        const viewportWidth = window.innerWidth; // Width of the viewport.

        // Calculate tooltip position to avoid overflow.
        const adjustedX = (xPosition + tooltipWidth > viewportWidth) 
          ? xPosition - tooltipWidth - 10 // Adjust position if overflowing.
          : xPosition + 10; // Default position.

        setTooltipData({
          visible: true,
          x: adjustedX,
          y: event.pageY - 28,
          data: {
            name: sourceNode.name,
            value: d.value,
            target: targetNode.name,
            session: sourceNode.session
          }
        });
      })
      .on('mouseout', (event, d) => {
        d3.select(event.currentTarget)
          .attr('stroke-opacity', 0.7) // Reset opacity on mouse out.
        
        setTooltipData(null); // Hide the tooltip on mouse out.
      });

    // Draw nodes (rectangles) in the Sankey diagram.
    svg.append('g')
      .selectAll('rect')
      .data(nodes)
      .join('rect')
      .attr('x', d => d.x0)
      .attr('y', d => d.y0)
      .attr('height', d => d.y1 - d.y0)
      .attr('width', d => d.x1 - d.x0)
      .attr('fill', d => d.color) // Fill color for nodes.
      .attr('stroke', '#000') // Border color for nodes.
      .on('mouseover', (event, d) => {
        const tooltipWidth = 200; // Width of the tooltip.
        const xPosition = event.pageX; // Current mouse x position.
        const viewportWidth = window.innerWidth; // Width of the viewport.

        // Calculate tooltip position to avoid overflow.
        const adjustedX = (xPosition + tooltipWidth > viewportWidth) 
          ? xPosition - tooltipWidth - 10
          : xPosition + 10;

        setTooltipData({
          visible: true,
          x: adjustedX,
          y: event.pageY - 28,
          data: {
            name: d.name,
            value: d.value,
            session: d.session
          }
        });
      })
      .on('mouseout', () => {
        setTooltipData(null); // Hide the tooltip on mouse out.
      });

    // Add labels to nodes.
    svg.append('g')
      .attr('font-family', 'sans-serif')
      .attr('font-size', 10)
      .selectAll('text')
      .data(nodes)
      .join('text')
      .attr('x', d => d.x0 < width / 2 ? d.x1 + 6 : d.x0 - 6) // Position text to the right or left of nodes.
      .attr('y', d => (d.y1 + d.y0) / 2) // Vertically center the text.
      .attr('dy', '0.35em')
      .attr('text-anchor', d => d.x0 < width / 2 ? 'start' : 'end') // Align text based on position.
      .text(d => d.name); // Display the node name.

  }, [sessions, topWords]); // Redraw the diagram if `sessions` or `topWords` changes.

  return (
    <div style={{ padding: '20px' }}> {/* Padding around the SVG container */}
      <svg ref={svgRef} />
      {tooltipData && tooltipData.visible && ( // Display the tooltip if it's visible.
        <Tooltip tooltipData={tooltipData.data} position={{ x: tooltipData.x, y: tooltipData.y }} />
      )}
    </div>
  );
}

export default SankeyDiagram;
