async function drawList() {
  const dataset = await d3.csv("./emperors.csv")
  console.log(dataset)

  const namesAccessor = d => d.names
  const width = 500

    let dimensions = {
    width: width,
    height: width * 0.6,
    margin: {
      top: 30,
      right: 10,
      bottom: 50,
      left: 50,
    },
  }

    dimensions.boundedWidth = dimensions.width - dimensions.margin.left - dimensions.margin.right
    dimensions.boundedHeight = dimensions.height - dimensions.margin.top - dimensions.margin.bottom
    
    const exitTransition = d3.transition()
    .duration(600)

  const updateTransition = exitTransition.transition()
    .duration(600)

      // create chart area
  const wrapper = d3.select("#wrapper")
  .append("svg")
    .attr("width", dimensions.width)
    .attr("height", dimensions.height)

const bounds = wrapper.append("g")
    .style("transform", `translate(${dimensions.margin.left}px, ${dimensions.margin.top}px)`)

      const text = bounds.select("g").append("text")
        .transition(updateTransition)
          .text(d => yAccessor(d) || "")
  //   bounds.append("defs").append("clipPath")
  //   .attr("id", "bounds-clip-path")
  // .append("rect")
  //   .attr("width", dimensions.boundedWidth)
  //   .attr("height", dimensions.boundedHeight)

    
}
drawList()

// async function drawBars() {
//   // load data
//   console.log("loaded!")
//   const dataset = await d3.csv("./emperorsTest.csv")
// console.log(dataset)
//   // const width = window.innerWidth * 0.95
//   const width = 500
//   let dimensions = {
//     width: width,
//     height: width * 0.6,
//     margin: {
//       top: 30,
//       right: 10,
//       bottom: 50,
//       left: 50,
//     },
//   }

//   dimensions.boundedWidth = dimensions.width - dimensions.margin.left - dimensions.margin.right
//   dimensions.boundedHeight = dimensions.height - dimensions.margin.top - dimensions.margin.bottom

//    const drawHistogram = metric => {
//      const metricAccessor = d => d[metric]
//       const dateParser = d3.timeParse("%Y-%m-%d")

  //   const x1Accessor = d => dateParser(d.reign.start)
  //   console.log(x1Accessor)
  //   const x2Accessor = d => dateParser(d.reign.end)
  //   const dynastyAccessor = d => d.dynasty
  //   const nameAccessor = d => d.name

  //   // const time = Date.Prototype.getDate(x1Accessor)
  //   // console.log(time)


  //   const startDate = dateParser(x1Accessor)
  //   const endDate = dateParser(x2Accessor)

  //   console.log(startDate)

  //   // create chart area
  //   const wrapper = d3.select("#wrapper")
  //     .append("svg")
  //       .attr("width", dimensions.width)
  //       .attr("height", dimensions.height)

  //   const bounds = wrapper.append("g")
  //       .style("transform", `translate(${dimensions.margin.left}px, ${dimensions.margin.top}px)`)

  //   // create scales
  //   const xScale = d3.scaleLinear()
  //     .domain(d3.extent(dataset, metricAccessor))
  //     .range([0, dimensions.boundedWidth])
  //     .nice()

  //   const binsGenerator = d3.histogram()
  //     .domain(xScale.domain())
  //     .value(metricAccessor)
  //     .thresholds(12)

  //   const bins = binsGenerator(dataset)

  //   const yScale = d3.scaleLinear()
  //     .domain([0, d3.max(bins, yAccessor)])
  //     .range([dimensions.boundedHeight, 0])
  //     .nice()

  //   // draw the points
  //   const binGroups = bounds.selectAll("g")
  //     .data(bins)
  //     .enter().append("g")

  //   const firstBin = bins[0]
  //   const barWidth = xScale(firstBin.x1) - xScale(firstBin.x0)
  //   const barPadding = 1
  //   const barRects = binGroups.append("rect")
  //       .attr("x", d => xScale(d.x0) + barPadding)
  //       .attr("y", d => yScale(yAccessor(d)))
  //       .attr("width", barWidth - barPadding)
  //       .attr("height", d => dimensions.boundedHeight - yScale(yAccessor(d)))
  //       .attr("fill", "cornflowerblue")

  //   const barText = binGroups.filter(yAccessor)
  //     .append("text")
  //       .attr("x", d => xScale(d.x0) + barWidth / 2)
  //       .attr("y", d => yScale(yAccessor(d)) - 5)
  //       .text(yAccessor)
  //       .style("text-anchor", "middle")
  //       .attr("fill", "darkgrey")
  //       .style("font-size", "12px")
  //       .style("font-family", "sans-serif")

  //   const mean = d3.mean(dataset, metricAccessor)
  //   const meanLine = bounds.append("line")
  //     .attr("x1", xScale(mean))
  //     .attr("x2", xScale(mean))
  //     .attr("y1", -20)
  //     .attr("y2", dimensions.boundedHeight)
  //     .attr("stroke", "maroon")
  //     .attr("stroke-dasharray", "2px 4px")

  //   // draw axes
  //   const xAxisGenerator = d3.axisBottom()
  //     .scale(xScale)

  //   const xAxis = bounds.append("g")
  //     .call(xAxisGenerator)
  //       .style("transform", `translateY(${dimensions.boundedHeight}px)`)

  //   const xAxisLabel = xAxis.append("text")
  //       .attr("x", dimensions.boundedWidth / 2)
  //       .attr("y", dimensions.margin.bottom - 10)
  //       .attr("fill", "black")
  //       .style("font-size", "1.4em")
  //       .text(metric)
  //       .style("text-transform", "capitalize")
  // }

  // const metrics = [
  //   "windSpeed",
  //   "moonPhase",
  //   "dewPoint",
  //   "humidity",
  //   "uvIndex",
  //   "windBearing",
  //   "temperatureMin",
  //   "temperatureMax",
  // ]

  // metrics.forEach(drawHistogram)
// }
// drawBars()
