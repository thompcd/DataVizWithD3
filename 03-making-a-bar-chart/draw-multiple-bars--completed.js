async function drawBars() {
  // load data
  const dataset = await d3.json("./../my_weather_data.json")

  // const width = window.innerWidth * 0.95
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

  const drawHistogram = metric => {
    const metricAccessor = d => d[metric]
    const yAccessor = d => d.length

    // create chart area
    const wrapper = d3.select("#wrapper")
      .append("svg")
        .attr("width", dimensions.width)
        .attr("height", dimensions.height)

    const bounds = wrapper.append("g")
        .style("transform", `translate(${dimensions.margin.left}px, ${dimensions.margin.top}px)`)

    // create scales
    const xScale = d3.scaleLinear()
      .domain(d3.extent(dataset, metricAccessor))
      .range([0, dimensions.boundedWidth])
      .nice()

    const binsGenerator = d3.histogram()
      .domain(xScale.domain())
      .value(metricAccessor)
      .thresholds(12)

    const bins = binsGenerator(dataset)

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(bins, yAccessor)])
      .range([dimensions.boundedHeight, 0])
      .nice()

    // draw the points
    const binGroups = bounds.selectAll("g")
      .data(bins)
      .enter().append("g")

    const firstBin = bins[0]
    const barWidth = xScale(firstBin.x1) - xScale(firstBin.x0)
    const barPadding = 1
    const barRects = binGroups.append("rect")
        .attr("x", d => xScale(d.x0) + barPadding)
        .attr("y", d => yScale(yAccessor(d)))
        .attr("width", barWidth - barPadding)
        .attr("height", d => dimensions.boundedHeight - yScale(yAccessor(d)))
        .attr("fill", "cornflowerblue")

    const barText = binGroups.filter(yAccessor)
      .append("text")
        .attr("x", d => xScale(d.x0) + barWidth / 2)
        .attr("y", d => yScale(yAccessor(d)) - 5)
        .text(yAccessor)
        .style("text-anchor", "middle")
        .attr("fill", "darkgrey")
        .style("font-size", "12px")
        .style("font-family", "sans-serif")

    const mean = d3.mean(dataset, metricAccessor)
    const meanLine = bounds.append("line")
      .attr("x1", xScale(mean))
      .attr("x2", xScale(mean))
      .attr("y1", -20)
      .attr("y2", dimensions.boundedHeight)
      .attr("stroke", "maroon")
      .attr("stroke-dasharray", "2px 4px")

    // draw axes
    const xAxisGenerator = d3.axisBottom()
      .scale(xScale)

    const xAxis = bounds.append("g")
      .call(xAxisGenerator)
        .style("transform", `translateY(${dimensions.boundedHeight}px)`)

    const xAxisLabel = xAxis.append("text")
        .attr("x", dimensions.boundedWidth / 2)
        .attr("y", dimensions.margin.bottom - 10)
        .attr("fill", "black")
        .style("font-size", "1.4em")
        .text(metric)
        .style("text-transform", "capitalize")
  }

  const metrics = [
    "windSpeed",
    "moonPhase",
    "dewPoint",
    "humidity",
    "uvIndex",
    "windBearing",
    "temperatureMin",
    "temperatureMax",
  ]

  metrics.forEach(drawHistogram)
}
drawBars()
