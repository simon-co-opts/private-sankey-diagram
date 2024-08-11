import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import { sankey as d3Sankey, sankeyLinkHorizontal } from 'd3-sankey';
import Tooltip from '../components/Tooltip'; // Correct path to Tooltip component
import '../styling/Tooltip.css'; // Correct path to Tooltip CSS

function transformDataToSankeyFormat(sessions) {
  const nodes = [];
  const links = [];
  const nodeMap = {};

  // Modified to include value for nodes
  function addNode(word, sessionIndex, index, value) {
    const nodeId = `${sessionIndex}-${word}`;
    if (!nodeMap[nodeId]) {
      nodes.push({ id: nodeId, name: word, session: sessionIndex, index, value }); // Added value here
      nodeMap[nodeId] = nodes.length - 1;
    }
  }

  sessions.forEach((session, sessionIndex) => {
    const topWords = session.wordFrequencies.map(w => w.word);

    topWords.forEach((word, i) => {
      addNode(word, sessionIndex, i);
    });

    const infrequentlyUsed = 'infrequently used';
    const notUsed = 'not used';
    const topWordSet = new Set(topWords);

    sessions.forEach((_, nextSessionIndex) => {
      if (nextSessionIndex > sessionIndex) {
        const nextSessionWords = sessions[nextSessionIndex].wordFrequencies.map(w => w.word);

        nextSessionWords.forEach(word => {
          if (topWordSet.has(word)) {
            if (!nodeMap[`${sessionIndex}-${word}`]) {
              addNode(word, sessionIndex, topWords.indexOf(word));
            }
            if (!nodeMap[`${nextSessionIndex}-${word}`]) {
              addNode(word, nextSessionIndex, nextSessionWords.indexOf(word));
            }
            links.push({ source: nodeMap[`${sessionIndex}-${word}`], target: nodeMap[`${nextSessionIndex}-${word}`], value: 1, targetWord: word });
          }
        });

        topWords.forEach((word) => {
          if (!nextSessionWords.includes(word)) {
            const notUsedNode = `${nextSessionIndex}-${notUsed}`;
            if (!nodeMap[notUsedNode]) {
              addNode(notUsed, nextSessionIndex, 7);
            }
            links.push({ source: nodeMap[`${sessionIndex}-${word}`], target: nodeMap[notUsedNode], value: 1 });
          } else if (!nextSessionWords.includes(word)) {
            const infrequentlyUsedNode = `${nextSessionIndex}-${infrequentlyUsed}`;
            if (!nodeMap[infrequentlyUsedNode]) {
              addNode(infrequentlyUsed, nextSessionIndex, 6);
            }
            links.push({ source: nodeMap[`${sessionIndex}-${word}`], target: nodeMap[infrequentlyUsedNode], value: 1 });
          }
        });
      }
    });
  });

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

    const width = 800;
    const height = 600;

    const sankey = d3Sankey()
      .nodeWidth(15)
      .nodePadding(10)
      .extent([[1, 1], [width - 1, height - 5]]);

    // Transform the data into the format needed by d3-sankey
    const { nodes, links } = sankey({
      nodes: sankeyData.nodes.map(d => ({ ...d, id: undefined })), // Remove id, if not needed
      links: sankeyData.links.map(d => ({ ...d }))
    });

    svg.attr('viewBox', [0, 0, width, height]);

    svg.append('g')
      .attr('fill', 'none')
      .attr('stroke', '#000')
      .attr('stroke-opacity', 0.2)
      .selectAll('path')
      .data(links)
      .join('path')
      .attr('d', sankeyLinkHorizontal())
      .attr('stroke-width', d => Math.max(1, d.width))
      .on('mouseover', (event, d) => {
        setTooltipData({ visible: true, x: event.pageX + 10, y: event.pageY - 28, data: { word: d.source.name, value: d.value, target: d.targetWord } });
      })
      .on('mouseout', () => {
        setTooltipData(null); // Hide tooltip
      });

    svg.append('g')
      .selectAll('rect')
      .data(nodes)
      .join('rect')
      .attr('x', d => d.x0)
      .attr('y', d => d.y0)
      .attr('height', d => d.y1 - d.y0)
      .attr('width', d => d.x1 - d.x0)
      .attr('fill', d => d.color || '#000')
      .attr('stroke', '#000')
      .on('mouseover', (event, d) => {
        setTooltipData({ visible: true, x: event.pageX + 10, y: event.pageY - 28, data: { word: d.name, value: d.value } });
      })
      .on('mouseout', () => {
        setTooltipData(null); // Hide tooltip
      });

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
    <div>
      <svg ref={svgRef} />
      <Tooltip tooltipData={tooltipData} position={{ x: tooltipData?.x, y: tooltipData?.y }} />
    </div>
  );
}

export default SankeyDiagram;
