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
    const addNode = (id, name) => {
      if (!nodeMap.has(id)) {
        const newNode = { id, name };
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

    const columnNodes = [];
    const infrequentUsedNodes = new Set();
    const notUsedNodes = new Set();

    data.forEach((sessionData, sessionIndex) => {
      const sessionWords = Object.entries(sessionData.wordFrequencies)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([word, frequency], idx) => ({
          word,
          nodeId: `word_${sessionIndex}_${idx}`,
          frequency
        }));

      columnNodes.push(sessionWords);

      sessionWords.forEach(({ word, nodeId, frequency }) => {
        addNode(nodeId, word);
        let matched = false;
        for (let nextIndex = sessionIndex + 1; nextIndex < data.length; nextIndex++) {
          const nextSessionWords = Object.keys(data[nextIndex].wordFrequencies);
          if (nextSessionWords.includes(word)) {
            const targetNodeId = `word_${nextIndex}_${nextSessionWords.indexOf(word)}`;
            addNode(targetNodeId, word);
            addLink(nodeId, targetNodeId, frequency);
            matched = true;
            break;
          }
        }

        if (!matched) {
          const infrequentNodeId = `infrequent_${sessionIndex}`;
          const notUsedNodeId = `not_used_${sessionIndex}`;
          addNode(infrequentNodeId, 'Infrequently Used');
          addNode(notUsedNodeId, 'Not Used');

          infrequentUsedNodes.add(infrequentNodeId);
          notUsedNodes.add(notUsedNodeId);

          addLink(nodeId, infrequentNodeId, frequency > 1 ? frequency : 0);
          addLink(nodeId, notUsedNodeId, frequency === 1 ? frequency : 0);
        }
      });
    });

    // Additional logic for adding infrequent and not used nodes in columns 2-4
    columnNodes.forEach((sessionWords, sessionIndex) => {
      if (sessionIndex > 0) {
        const additionalNodes = [];
        additionalNodes.push({ word: 'Infrequently Used', nodeId: `infrequent_${sessionIndex}` });
        additionalNodes.push({ word: 'Not Used', nodeId: `not_used_${sessionIndex}` });

        additionalNodes.forEach(({ word, nodeId }) => {
          addNode(nodeId, word);
          sessionWords.slice(0, 5).forEach(({ nodeId: sourceNodeId }) => {
            addLink(sourceNodeId, nodeId, 0); // No direct value, just a placeholder link
          });
        });
      }
    });

    // Assign positions to nodes manually
    const width = 450;
    const height = 720;
    const columnWidth = width / 4;
    const rowHeight = height / 7;

    processedData.nodes.forEach((node) => {
      const sessionIndex = parseInt(node.id.split('_')[1], 10);
      const wordIndex = parseInt(node.id.split('_')[2], 10);
      node.x0 = sessionIndex * columnWidth;
      node.x1 = node.x0 + columnWidth;
      node.y0 = wordIndex * rowHeight;
      node.y1 = node.y0 + rowHeight;
    });

    const svg = d3.select(svgRef.current);
    svg.attr('width', width).attr('height', height);

    const sankeyLayout = sankey()
      .nodeWidth(10)
      .nodePadding(10)
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
      console.error('Error rendering Sankey diagram:', error);
    }
  }, [data]);

  return (
    <div className="sankey-container">
      <div className="sankey-svg-wrapper"></div>
      <svg ref={svgRef}></svg>
      {tooltipData && <TooltipComponent data={tooltipData} />}
    </div>
  );
};

export default SankeyDiagram;
