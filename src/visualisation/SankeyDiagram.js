import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import { sankey as d3Sankey, sankeyLinkHorizontal } from 'd3-sankey';
import Tooltip from '../components/Tooltip';
import '../styling/Tooltip.css';

// This updates the color schema with specified colors which will be handed over to the dahsboard to control this
const colorSchema = d3.scaleOrdinal()
  .domain([1, 2, 3, 4])
  .range(['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728']);

function transformDataToSankeyFormat(sessions, topWords) {
  const nodes = [];
  const links = [];
  const nodeMap = {}; // This is mapping the node id to the node index in the nodes array
  const sessionWidth = 100; // This controls the width for each session column
  const nodePadding = 10; // This controls the padding between nodes

  // This adds all top words from each session as nodes
  sessions.forEach((session, sessionIndex) => {
    const topWordsList = session.wordFrequencies.slice(0, topWords).map((w, i) => ({
      name: w.word,
      index: i,
      value: w.value
    }));

    topWordsList.forEach((item) => {
      const nodeId = `${sessionIndex + 1}-${item.name}`; // Adjust session index to start from 1
      if (!nodeMap[nodeId]) {
        nodes.push({
          id: nodeId,
          name: item.name,
          session: sessionIndex + 1, // Adjust session index to start from 1
          index: item.index,
          value: item.value,
          color: colorSchema(sessionIndex + 1), // Adjust session index to start from 1
          x0: sessionIndex * (sessionWidth + nodePadding), // Position by session column
          x1: sessionIndex * (sessionWidth + nodePadding) + sessionWidth
        });
        nodeMap[nodeId] = nodes.length - 1;
      }
    });
  });

  // Create links between sessions
  for (let i = 0; i < sessions.length - 1; ++i) {
    const currentSessionWords = new Set(sessions[i].wordFrequencies.slice(0, topWords).map(w => w.word));
    const nextSessionWords = sessions[i + 1].wordFrequencies.slice(0, topWords).map(w => w.word);

    // Links for words that are present in both sessions
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
        // Handle nodes that are not used in the next session
        const infrequentlyUsedNodeId = `${i + 2}-infrequently used`;
        if (!nodeMap[infrequentlyUsedNodeId]) {
          nodes.push({
            id: infrequentlyUsedNodeId,
            name: 'infrequently used',
            session: i + 2, // Adjust session index to start from 1
            index: topWords + 1,
            value: 25,
            color: colorSchema(i + 2), // Adjust session index to start from 1
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

    // Handle words in the next session that did not match any words in the current session
    nextSessionWords.forEach(word => {
      if (!currentSessionWords.has(word)) {
        const notUsedNodeId = `${i + 1}-not used`;
        if (!nodeMap[notUsedNodeId]) {
          nodes.push({
            id: notUsedNodeId,
            name: 'not used',
            session: i + 1, // Adjust session index to start from 1
            index: topWords + 2,
            value: 30,
            color: colorSchema(i + 2), // Adjust session index to start from 1
            x0: (i + 1) * (sessionWidth + nodePadding),
            x1: (i + 1) * (sessionWidth + nodePadding) + sessionWidth
          });
          nodeMap[notUsedNodeId] = nodes.length - 1;
        }
        // Only link to "not used" if the word existed in the previous session
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

  console.log('Transformed Nodes:', nodes);
  console.log('Transformed Links:', links);

  return { nodes, links };
}

function SankeyDiagram({ sessions, topWords }) {
  const svgRef = useRef();
  const [tooltipData, setTooltipData] = useState(null);

  useEffect(() => {
    const sankeyData = transformDataToSankeyFormat(sessions, topWords);

    if (!sankeyData || !sankeyData.nodes || !sankeyData.links) {
      console.warn('Invalid data structure:', sankeyData);
      return;
    }

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Clear previous contents

    const width = 1000;  // Increased width to accommodate padding
    const height = 800;  // Increased height to accommodate padding

    const sankey = d3Sankey()
      .nodeWidth(15)
      .nodePadding(10)
      .extent([[10, 10], [width - 10, height - 10]]) // Added padding
      .nodeSort(null); // Disable automatic sorting of nodes

    // Create the sankey layout
    const { nodes, links } = sankey({
      nodes: sankeyData.nodes.map(d => ({ ...d })),
      links: sankeyData.links.map(d => ({ ...d }))
    });

    console.log('Processed Nodes:', nodes);
    console.log('Processed Links:', links);

    svg.attr('viewBox', [0, 0, width, height])
      .style('padding', '20px'); // Added padding around SVG

    // Create gradient definitions for links
    const defs = svg.append('defs');
    defs.selectAll('linearGradient')
      .data(links)
      .enter().append('linearGradient')
      .attr('id', (d, i) => `gradient-${i}`)
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '100%')
      .attr('y2', '0%') // Horizontal gradient
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

    // Draw the links (paths between nodes)
    svg.append('g')
      .attr('fill', 'none')
      .selectAll('path')
      .data(links)
      .join('path')
      .attr('d', sankeyLinkHorizontal())
      .attr('stroke', d => `url(#gradient-${links.indexOf(d)})`)
      .attr('stroke-width', d => Math.max(1, d.width))
      .attr('fill', 'none')
      .attr('stroke-opacity', 0.5) // Slight transparency
      .on('mouseover', (event, d) => {
        const sourceNode = nodes[d.source.index];
        const targetNode = nodes[d.target.index];
        const tooltipWidth = 200; // Approximate width of the tooltip
        const xPosition = event.pageX;
        const viewportWidth = window.innerWidth;

        // Calculate the tooltip position and flip if necessary
        const adjustedX = (xPosition + tooltipWidth > viewportWidth) 
          ? xPosition - tooltipWidth - 10 // Position to the left if overflowing
          : xPosition + 10; // Position to the right

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
      .on('mouseout', () => {
        setTooltipData(null); // Hide tooltip
      });

    // Draw the nodes (rectangles)
    svg.append('g')
      .selectAll('rect')
      .data(nodes)
      .join('rect')
      .attr('x', d => d.x0)
      .attr('y', d => d.y0)
      .attr('height', d => d.y1 - d.y0)
      .attr('width', d => d.x1 - d.x0)
      .attr('fill', d => d.color)
      .attr('stroke', '#000')
      .on('mouseover', (event, d) => {
        const tooltipWidth = 200; // Approximate width of the tooltip
        const xPosition = event.pageX;
        const viewportWidth = window.innerWidth;

        // Calculate the tooltip position and flip if necessary
        const adjustedX = (xPosition + tooltipWidth > viewportWidth) 
          ? xPosition - tooltipWidth - 10 // Position to the left if overflowing
          : xPosition + 10; // Position to the right

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
        setTooltipData(null); // Hide tooltip
      });

    // Add labels to the nodes
    svg.append('g')
      .attr('font-family', 'sans-serif')
      .attr('font-size', 10)
      .selectAll('text')
      .data(nodes)
      .join('text')
      .attr('x', d => d.x0 < width / 2 ? d.x1 + 6 : d.x0 - 6)
      .attr('y', d => (d.y1 + d.y0) / 2)
      .attr('dy', '0.35em')
      .attr('text-anchor', d => d.x0 < width / 2 ? 'start' : 'end')
      .text(d => d.name);

  }, [sessions, topWords]); // Add topWords as a dependency

  return (
    <div style={{ padding: '20px' }}> {/* Added padding to container */}
      <svg ref={svgRef} />
      {tooltipData && tooltipData.visible && ( // Ensure tooltipData is defined and visible is true
        <Tooltip tooltipData={tooltipData.data} position={{ x: tooltipData.x, y: tooltipData.y }} />
      )}
    </div>
  );
}

export default SankeyDiagram;
