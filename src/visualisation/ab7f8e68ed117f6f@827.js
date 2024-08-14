// https://observablehq.com/@mariodelgadosr/sankey-diagram-with-draggable-nodes@827
import define1 from "./a2e58f97fd5e8d7c@756.js";

function _1(md){return(
md`# Sankey Diagram With Draggable Nodes

* [Mike Bostock](https://observablehq.com/@mbostock)'s [*Sankey Diagram*](https://observablehq.com/@d3/sankey-diagram) enahced with draggable nodes.
* Draggable behavior was originally in [*Draggable D3 Sankey Diagram*](https://observablehq.com/@geekplux/dragable-d3-sankey-diagram), but re-worked here for [D3V6](https://observablehq.com/@d3/d3v6-migration-guide).
* Logic was updated to allow the prepending of a ***Total*** node to the visualization: See comments in [*chart*](#chart) for the two alternative patterns to calculate ***Total*** from either the information in the derived [*sankey* object](#chart) or the original [*data*](#data]).
`
)}

function _edgeColor(Select)
{
  
  const options = new Map([["Color by input","input"],
   ["Color by output", "output"],
   ["Color by input-output", "path"],
   ["No color","none"]
  ])
  
  return Select(options, {value: "path", label: "Edge Color"})
  
}


function _align(Select)
{
  
  const options = new Map([["Left-aligned","left"],
   ["Right-aligned", "right"],
   ["Centered", "center"],
   ["Justified","justify"]
  ])
  
  return Select(options, {value: "justify", label: "Align"})
  
}


function _showTotal(Toggle){return(
Toggle({label: "Total", value: false})
)}

function _chart(d3,width,height,align,data,showTotal,color,format,edgeColor,DOM)
{
  const svg = d3.create("svg").attr("viewBox", [0, 0, width, height]);

  // Defining 'sankey' here because update will be used in dragMove: https://github.com/d3/d3-sankey#sankey_update
  const sankey = d3
    .sankey()
    .nodeId((d) => d.name)
    .nodeAlign(d3[`sankey${align[0].toUpperCase()}${align.slice(1)}`])
    .nodeWidth(15)
    .nodePadding(10)
    .extent([
      [1, 5],
      [width - 1, height - 5]
    ]);

  //This logic makes a copy of data.nodes and data.links, which will be extended with drag logic

  let dataNodes = data.nodes.map((d) => Object.assign({}, d));
  let dataLinks = data.links.map((d) => Object.assign({}, d));

  let group = sankey({ nodes: dataNodes, links: dataLinks });

  // Prepend a 'Total' Node to chart.  To do so, extract total values from group sankey structure for top nodes.
  // An alternative pattern to determine the 'Total' node's properties form the original 'data' is shown below
  // at the end of this cell.
  if (showTotal) {
    const totalLinks = group.nodes
      .filter(({ targetLinks }) => targetLinks.length == 0)
      .map(({ name, value }) => ({ source: "Total", target: name, value }));

    dataNodes = [{ name: "Total", category: "Total" }].concat(dataNodes);

    dataLinks = totalLinks.concat(dataLinks);

    group = sankey({ nodes: dataNodes, links: dataLinks });
  } // if

  const nodes = group.nodes;
  const links = group.links;

  const nodeWidth = nodes[0].x1 - nodes[0].x0;

  // Container for draggable nodes
  const node = svg
    .selectAll("g")
    .data(nodes)
    .join("g")
    .attr("transform", (d) => `translate(${d.x0}, ${d.y0})`);

  // Relative to container
  node
    .append("rect")
    .attr("height", (d) => d.y1 - d.y0)
    .attr("width", (d) => d.x1 - d.x0)
    .attr("fill", color)
    .attr("stroke", "#000")
    .append("title")
    .text((d) => `${d.name}\n${format(d.value)}`);

  // Relative to container/ node rect
  node
    .append("text")
    .attr("font-family", "sans-serif")
    .attr("font-size", 10)
    .attr("x", (d) => (d.x0 < width / 2 ? 6 + (d.x1 - d.x0) : -6)) // +/- 6 pixels relative to container
    .attr("y", (d) => (d.y1 - d.y0) / 2) // middle of node
    .attr("dy", "0.35em")
    .attr("text-anchor", (d) => (d.x0 < width / 2 ? "start" : "end"))
    .text((d) => d.name);

  // d3V6 events: https://observablehq.com/@d3/d3v6-migration-guide#events
  node
    .attr("cursor", "move")
    .call(d3.drag().on("start", dragStart).on("drag", dragMove));

  const link = svg
    .append("g")
    .attr("fill", "none")
    .attr("stroke-opacity", 0.5)
    .selectAll("g")
    .data(links)
    .join("g")
    .style("mix-blend-mode", "multiply");

  if (edgeColor === "path") {
    const gradient = link
      .append("linearGradient")
      .attr("id", (d) => (d.uid = DOM.uid("link")).id)
      .attr("gradientUnits", "userSpaceOnUse")
      .attr("x1", (d) => d.source.x1)
      .attr("x2", (d) => d.target.x0);

    gradient
      .append("stop")
      .attr("offset", "0%")
      .attr("stop-color", (d) => color(d.source));

    gradient
      .append("stop")
      .attr("offset", "100%")
      .attr("stop-color", (d) => color(d.target));
  } //if

  link
    .append("path")
    .attr("class", "link")
    .attr("d", d3.sankeyLinkHorizontal())
    .attr("stroke", (d) =>
      edgeColor === "none"
        ? "#aaa"
        : edgeColor === "path"
        ? d.uid
        : edgeColor === "input"
        ? color(d.source)
        : color(d.target)
    )
    .attr("stroke-width", (d) => Math.max(1, d.width));

  link
    .append("title")
    .text((d) => `${d.source.name} → ${d.target.name}\n${format(d.value)}`);

  function dragStart(event, d) {
    d.__x = event.x;
    d.__y = event.y;
    d.__x0 = d.x0;
    d.__y0 = d.y0;
    d.__x1 = d.x1;
    d.__y1 = d.y1;
  } //dragStart

  function dragMove(event, d) {
    d3.select(this).attr("transform", function (d) {
      const dx = event.x - d.__x;
      const dy = event.y - d.__y;
      d.x0 = d.__x0 + dx;
      d.x1 = d.__x1 + dx;
      d.y0 = d.__y0 + dy;
      d.y1 = d.__y1 + dy;

      if (d.x0 < 0) {
        d.x0 = 0;
        d.x1 = nodeWidth;
      } // if

      if (d.x1 > width) {
        d.x0 = width - nodeWidth;
        d.x1 = width;
      } // if

      if (d.y0 < 0) {
        d.y0 = 0;
        d.y1 = d.__y1 - d.__y0;
      } // if

      if (d.y1 > height) {
        d.y0 = height - (d.__y1 - d.__y0);
        d.y1 = height;
      } // if

      return `translate(${d.x0}, ${d.y0})`;
    }); //.attr('transform', function (d) {

    // https://github.com/d3/d3-sankey#sankey_update
    sankey.update({ nodes, links });
    link.selectAll(".link").attr("d", d3.sankeyLinkHorizontal());
  } //dragMove

  return svg.node();

  /* 
The sankey method summarizes top nodes and is used above to determine the 'Total' node. 

One alternative pattern to determine the 'Total' node's properties directly from 'data' is to use the robust Arquero library (https://observablehq.com/@uwdata/introducing-arquero) and do basic relational data manipulation:

 import { aq, op } from '@uwdata/arquero'
 
 // https://uwdata.github.io/arquero/api#from
 const links = aq.from(data.links);
 
 // https://uwdata.github.io/arquero/api/verbs#select
 // https://uwdata.github.io/arquero/api/verbs#dedupe
 const sources = links.select("source").dedupe('source'); 
 const targets = links.select("target").dedupe('target');
 
 // https://uwdata.github.io/arquero/api/verbs#antijoin
 const orphans = sources.antijoin(targets,['source', 'target']);
 
 // https://uwdata.github.io/arquero/api/verbs#semijoin
 const totalLinks = links.semijoin(orphans).groupby('source').rollup({value: d => op.sum(d.value)})
                        .objects()
                        .map(({source,value}) => ({source: "Total", target: source, value}));
 
  
  dataNodes = [{name: "Total", category: "Total"}].concat(dataNodes);
  
  dataLinks = totalLinks.concat(dataLinks);
  
  group = sankey({ nodes: dataNodes,
                   links: dataLinks
                 });   
  
*/
}


function _format(d3,data)
{
  const format = d3.format(",.0f");
  return data.units ? d => `${format(d)} ${data.units}` : format;
}


function _color(d3)
{
  // https://observablehq.com/@d3/d3-scaleordinal
  const color = d3.scaleOrdinal(d3.schemeCategory10);
  return d => color(d.category === undefined ? d.name : d.category);
}


async function _data(FileAttachment)
{
  const links = await FileAttachment("energy.csv").csv({typed: true});
  const nodes = Array.from(new Set(links.flatMap(l => [l.source, l.target])), name => ({name, category: name.replace(/ .*/, "")}));
  return {nodes, links, units: "TWh"};
}


function _width(){return(
954
)}

function _height(){return(
600
)}

function _d3(require){return(
require("d3@6", "d3-sankey@0.12")
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() { return this.url; }
  const fileAttachments = new Map([
    ["energy.csv", {url: new URL("./files/d6774e9422bd72369f195a30d3a6b33ff9d41676cff4d89c93511e1a458efb3cfd16cbb7ce3fecdd8dd2466121e10c9bfe57fd73c7520bf358d352a92b898614.csv", import.meta.url), mimeType: "text/csv", toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("viewof edgeColor")).define("viewof edgeColor", ["Select"], _edgeColor);
  main.variable(observer("edgeColor")).define("edgeColor", ["Generators", "viewof edgeColor"], (G, _) => G.input(_));
  main.variable(observer("viewof align")).define("viewof align", ["Select"], _align);
  main.variable(observer("align")).define("align", ["Generators", "viewof align"], (G, _) => G.input(_));
  main.variable(observer("viewof showTotal")).define("viewof showTotal", ["Toggle"], _showTotal);
  main.variable(observer("showTotal")).define("showTotal", ["Generators", "viewof showTotal"], (G, _) => G.input(_));
  main.variable(observer("chart")).define("chart", ["d3","width","height","align","data","showTotal","color","format","edgeColor","DOM"], _chart);
  main.variable(observer("format")).define("format", ["d3","data"], _format);
  main.variable(observer("color")).define("color", ["d3"], _color);
  main.variable(observer("data")).define("data", ["FileAttachment"], _data);
  main.variable(observer("width")).define("width", _width);
  main.variable(observer("height")).define("height", _height);
  main.variable(observer("d3")).define("d3", ["require"], _d3);
  const child1 = runtime.module(define1);
  main.import("Toggle", child1);
  main.import("Select", child1);
  return main;
}
