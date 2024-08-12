import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import { sankey as d3Sankey, sankeyLinkHorizontal } from 'd3-sankey';
import Tooltip from '../components/Tooltip';
import '../styling/Tooltip.css';

// Updated color schema with specified colors
const colorSchema = d3.scaleOrdinal()
  .domain([0, 1, 2, 3, 4, 5, 6, 7])
  .range(['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2', '#7f7f7f']);

function transformDataToSankeyFormat(sessions) {
  const nodes = [];
  const links = [];
  const nodeMap = {};

  function addNode(word, sessionIndex, index, value) {
    const nodeId = `${sessionIndex}-${word}`;
    if (!nodeMap[nodeId]) {
      nodes.push({ id: nodeId, name: word, session: sessionIndex, index, value, color: colorSchema(sessionIndex) });
      nodeMap[nodeId] = nodes.length - 1;
    }
  }

  sessions.forEach((session, sessionIndex) => {
    const topWords = session.wordFrequencies.slice(0, 5).map((w, i) => ({
      word: w.word,
      index: i,
      value: w.value,
    }));

    topWords.forEach(item => {
      addNode(item.word, sessionIndex, item.index, item.value);
    });

    const infrequentlyUsed = 'infrequently used';
    const notUsed = 'not used';
    const topWordSet = new Set(topWords.map(w => w.word));

    sessions.forEach((_, nextSessionIndex) => {
      if (nextSessionIndex > sessionIndex && nextSessionIndex === sessionIndex + 1) {
        const nextSessionWords = sessions[nextSessionIndex].wordFrequencies.slice(0, 5).map(w => w.word);

        nextSessionWords.forEach(word => {
          if (topWordSet.has(word)) {
            addNode(word, sessionIndex, topWords.find(w => w.word === word).index, topWords.find(w => w.word === word).value);
            addNode(word, nextSessionIndex, nextSessionWords.indexOf(word), sessions[nextSessionIndex].wordFrequencies.find(w => w.word === word).value);
            links.push({
              source: nodeMap[`${sessionIndex}-${word}`],
              target: nodeMap[`${nextSessionIndex}-${word}`],
              value: Math.min(
                session.wordFrequencies.find(w => w.word === word).value,
                sessions[nextSessionIndex].wordFrequencies.find(w => w.word === word).value
              ),
              targetWord: word
            });
          }
        });

        topWords.forEach((wordObj) => {
          if (!nextSessionWords.includes(wordObj.word)) {
            const notUsedNode = `${nextSessionIndex}-${notUsed}`;
            const infrequentlyUsedNode = `${nextSessionIndex}-${infrequentlyUsed}`;

            if (nextSessionWords.includes(wordObj.word)) {
              if (!nodeMap[infrequentlyUsedNode]) {
                addNode(infrequentlyUsed, nextSessionIndex, 6, 1);
              }
              links.push({ source: nodeMap[`${sessionIndex}-${wordObj.word}`], target: nodeMap[infrequentlyUsedNode], value: 1 });
            } else {
              if (!nodeMap[notUsedNode]) {
                addNode(notUsed, nextSessionIndex, 7, 1);
              }
              links.push({ source: nodeMap[`${sessionIndex}-${wordObj.word}`], target: nodeMap[notUsedNode], value: 1 });
            }
          }
        });
      }
    });
  });

  console.log('Transformed Nodes:', nodes);
  console.log('Transformed Links:', links);

  return { nodes, links };
}

function SankeyDiagram({ sessions }) {
  const svgRef = useRef();
  const [tooltipData, setTooltipData] = useState(null);

  useEffect(() => {
    const sankeyData = transformDataToSankeyFormat(sessions);

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

    const { nodes, links } = sankey({
      nodes: sankeyData.nodes.map(d => ({ ...d, id: undefined })), // Remove id if not needed
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
        // Add stops to gradient
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
        setTooltipData({ visible: true, x: event.pageX + 10, y: event.pageY - 28, data: { word: d.source.name, value: d.value, target: d.targetWord } });
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
        setTooltipData({ visible: true, x: event.pageX + 10, y: event.pageY - 28, data: { word: d.name, value: d.value } });
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

  }, [sessions]);

  return (
    <div style={{ padding: '20px' }}> {/* Added padding to container */}
      <svg ref={svgRef} />
      {tooltipData && <Tooltip tooltipData={tooltipData} position={{ x: tooltipData.x, y: tooltipData.y }} />}
    </div>
  );
}

export default SankeyDiagram;
