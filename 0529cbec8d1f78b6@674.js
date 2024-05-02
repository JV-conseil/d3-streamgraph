import define1 from "./a33468b95d0b15b0@817.js";

function _1(md) {
  return (
    md`<div style="color: grey; font: 13px/25.5px var(--sans-serif); text-transform: uppercase;"><h1 style="display: none;">Streamgraph</h1><a href="https://d3js.org/">D3</a> › <a href="/@d3/gallery">Gallery</a></div>

# EU Grants H2020 & HORIZON Streamgraph

<!--
This stacked area chart shows grants persons by cluster, 2000–2010. Data: [BLS](https://www.bls.gov/)
-->

This stacked area chart shows EU grants by cluster for H2020 and HORIZON, 2014–2025. Data: [EU](https://www.europa.eu/)`
  )
}

function _key(Swatches, chart) {
  return (
    Swatches(chart.scales.color, { columns: "180px" })
  )
}

function _chart(d3, data) {
  // Specify the chart’s dimensions.
  const width = 1600;
  const height = 400;
  const marginTop = 10;
  const marginRight = 10;
  const marginBottom = 20;
  const marginLeft = 40;

  // Determine the series that need to be stacked.
  const series = d3.stack()
    // .offset(d3.stackOffsetWiggle)
    .offset(d3.stackOffsetSilhouette)
    .order(d3.stackOrderInsideOut)
    .keys(d3.union(data.map(d => d.cluster))) // distinct series keys, in input order
    .value(([, D], key) => D.get(key).grants) // get value for each series key and stack
    (d3.index(data, d => d.date, d => d.cluster)); // group by stack then series key

  // Prepare the scales for positional and color encodings.
  const x = d3.scaleUtc()
    .domain(d3.extent(data, d => d.date))
    .range([marginLeft, width - marginRight]);

  const y = d3.scaleLinear()
    .domain(d3.extent(series.flat(2)))
    .rangeRound([height - marginBottom, marginTop]);

  const color = d3.scaleOrdinal()
    .domain(series.map(d => d.key))
    .range(d3.schemeTableau10);

  // Construct an area shape.
  const area = d3.area()
    .x(d => x(d.data[0]))
    .y0(d => y(d[0]))
    .y1(d => y(d[1]))
    .curve(d3.curveBasis);

  // Create the SVG container.
  const svg = d3.create("svg")
    .attr("viewBox", [0, 0, width, height])
    .attr("width", width)
    .attr("height", height)
    .attr("style", "max-width: 100%; height: auto;");

  // Add the y-axis, remove the domain line, add grid lines and a label.
  svg.append("g")
    .attr("transform", `translate(${marginLeft},0)`)
    .call(d3.axisLeft(y).ticks(height / 80).tickFormat((d) => Math.abs(d).toLocaleString("en-US")))
    .call(g => g.select(".domain").remove())
    .call(g => g.selectAll(".tick line").clone()
      .attr("x2", width - marginLeft - marginRight)
      .attr("stroke-opacity", 0.1))
    .call(g => g.append("text")
      .attr("x", -marginLeft)
      .attr("y", 10)
      .attr("fill", "currentColor")
      .attr("text-anchor", "start")
      .text("↑ Grants"));

  // Append the x-axis and remove the domain line.
  svg.append("g")
    .attr("transform", `translate(0,${height - marginBottom})`)
    .call(d3.axisBottom(x).tickSizeOuter(0))
    .call(g => g.select(".domain").remove());

  // Append a path for each series.
  svg.append("g")
    .selectAll()
    .data(series)
    .join("path")
    .attr("fill", d => color(d.key))
    .attr("d", area)
    .append("title")
    .text(d => d.key);

  // Return the chart with the color scale as a property (for the legend).
  return Object.assign(svg.node(), { scales: { color } });
}


function _data(FileAttachment) {
  return (
    FileAttachment("dataset.csv").csv({ typed: true })
  )
}

function _6(md) {
  return (
    md`Using [Observable Plot](https://observablehq.com/plot)’s concise API, you can create a similar chart with an [area mark](https://observablehq.com/plot/marks/area). See the [Plot: Wiggle streamgraph](https://observablehq.com/@observablehq/plot-stack-offset?intent=fork) example notebook.`
  )
}

function _7(Plot, data) {
  return (
    Plot.plot({
      marginLeft: 60,
      y: { grid: true },
      color: { legend: true, columns: 6 },
      marks: [
        Plot.areaY(data, { x: "date", y: "grants", fill: "cluster", offset: "wiggle" })
      ]
    })
  )
}

export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() { return this.url; }

  // const src = "./files/agg_nbcalls_cluster_01_05_2024.csv"
  const src = "https://gist.githubusercontent.com/JV-conseil/10d70b446fe0fc725d309b31302b0dde/raw/62a1388c11633ac0499f99ea3c292cea6f1fa71a/agg_nbcalls_cluster_01_05_2024.csv"

  const fileAttachments = new Map([
    ["dataset.csv", { url: new URL(src, import.meta.url), mimeType: "text/csv", toString }]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("key")).define("key", ["Swatches", "chart"], _key);
  main.variable(observer("chart")).define("chart", ["d3", "data"], _chart);
  main.variable(observer("data")).define("data", ["FileAttachment"], _data);

  const child1 = runtime.module(define1);
  main.import("Swatches", child1);

  // main.variable(observer()).define(["md"], _6);
  // main.variable(observer()).define(["Plot", "data"], _7);
  return main;
}
