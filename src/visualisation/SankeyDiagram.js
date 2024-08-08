// SankeyDiagram.js

import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import { sankey, sankeyLinkHorizontal } from 'd3-sankey';
import TooltipComponent from '../components/TooltipComponent'; // Ensure correct import path

const convertDataForSankey = (data) => {
  const nodeMap = new Map();
  const nodes = [];
  data.nodes.forEach((node, index) => {
    nodeMap.set(node.id, index);
    nodes.push({
      id: node.id,
      name: node.name,
      value: node.value || 0
    });
  });

  const links = data.links.map(link => ({
    source: nodeMap.get(link.source),
    target: nodeMap.get(link.target),
    value: link.value
  }));

  return { nodes, links };
};

// Simple hash function for UUIDs
const hashString = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

const SankeyDiagram = ({ data }) => {
  const svgRef = useRef();
  const [tooltipData, setTooltipData] = useState(null);

  useEffect(() => {
    if (!data || data.length === 0) return;

    const processedData = {
      nodes: [],
      links: []
    };

    const nodeMap = new Map();
    const addNode = (id, name, value = 0) => {
      if (!nodeMap.has(id)) {
        const newNode = { id, name, value };
        nodeMap.set(id, newNode);
        processedData.nodes.push(newNode);
      }
    };

    const addLink = (source, target, value) => {
      if (nodeMap.has(source) && nodeMap.has(target)) {
        processedData.links.push({
          source: nodeMap.get(source).id,
          target: nodeMap.get(target).id,
          value
        });
      } else {
        console.error('Missing source or target node:', source, target);
      }
    };

    // Determine column based on UUID
    const getColumnForUUID = (uuid) => {
      const numColumns = 4;
      const hash = Math.abs(hashString(uuid));
      return hash % numColumns;
    };

    // Process sessions
    const sessionData = [];
    data.forEach((sessionDataItem, sessionIndex) => {
      const { id, name, wordFrequencies } = sessionDataItem;
      const sortedWords = Object.entries(wordFrequencies)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([word, frequency], idx) => ({
          word,
          nodeId: `word_${id}_${sessionIndex}_${idx}`,
          frequency
        }));

      const column = getColumnForUUID(id);

      sessionData.push({
        sessionIndex,
        words: sortedWords,
        infrequentNodeId: `infrequent_${id}`,
        notUsedNodeId: `not_used_${id}`,
        column
      });

      // Add words as nodes
      sortedWords.forEach(({ word, nodeId, frequency }) => {
        addNode(nodeId, word, frequency);
      });

      // Add infrequent and not used nodes
      addNode(sessionData[sessionIndex].infrequentNodeId, 'Infrequently Used', 2);
      if (sortedWords.some(wordData => wordData.frequency > 0)) {
        addNode(sessionData[sessionIndex].notUsedNodeId, 'Not Used', 0);
      }
    });

    // Create links
    sessionData.forEach(({ words, infrequentNodeId, notUsedNodeId, column }, currentSessionIndex) => {
      words.forEach(({ nodeId: sourceNodeId, word, frequency }) => {
        let matched = false;
        if (currentSessionIndex < data.length - 1) {
          const nextSessionData = sessionData[currentSessionIndex + 1];
          nextSessionData.words.forEach(({ nodeId: targetNodeId, word: targetWord }) => {
            if (word === targetWord) {
              addLink(sourceNodeId, targetNodeId, frequency);
              matched = true;
            }
          });
        }
        if (!matched) {
          addLink(sourceNodeId, infrequentNodeId, frequency > 1 ? frequency : 0);
          if (currentSessionIndex < data.length - 1) {
            addLink(sourceNodeId, notUsedNodeId, frequency === 1 ? frequency : 0);
          }
        }
      });
    });

    const width = 800;
    const height = 1000;
    const columnWidth = width / 4;
    const rowHeight = height / Math.max(1, sessionData.length);

    const svg = d3.select(svgRef.current);
    svg.attr('width', width).attr('height', height);

    const sankeyLayout = sankey()
      .nodeWidth(20)
      .nodePadding(20)
      .extent([[1, 1], [width - 1, height - 5]]);

    try {
      const formattedData = convertDataForSankey(processedData);
      const { nodes, links } = sankeyLayout({
        nodes: formattedData.nodes.map(d => ({ ...d })),
        links: formattedData.links.map(d => ({ ...d }))
      });

      svg.selectAll('*').remove();

      const color = d3.scaleOrdinal(d3.schemeCategory10);

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
      console.error('Error rendering Sankey diagram:', error, processedData);
    }
  }, [data]);

  return (
    <div className="sankey-container">
      <svg ref={svgRef}></svg>
      {tooltipData && <TooltipComponent data={tooltipData} />}
    </div>
  );
};

export default SankeyDiagram;
