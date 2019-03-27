async function drawLineChart() {
  // load data
  let dataset = await d3.json("./../../../my_weather_data.json")

  // set data constants
  const yAccessor = d => d.pressure
  const dateParser = d3.timeParse("%Y-%m-%d")
  const dateFormatter = d3.timeFormat("%Y-%m-%d")
  const xAccessor = d => dateParser(d.date)
  dataset = dataset.sort((a,b) => xAccessor(a) - xAccessor(b))
  const weeks = d3.timeWeeks(xAccessor(dataset[0]), xAccessor(dataset[dataset.length - 1]))

  let dimensions = {
    width: window.innerWidth * 0.9,
    height: 400,
    margin: {
      top: 15,
      right: 15,
      bottom: 40,
      left: 60,
    },
  }
  dimensions.boundedWidth = dimensions.width - dimensions.margin.left - dimensions.margin.right
  dimensions.boundedHeight = dimensions.height - dimensions.margin.top - dimensions.margin.bottom

  // create chart area
  const wrapper = d3.select("#wrapper")
    .append("svg")
      .attr("width", dimensions.width)
      .attr("height", dimensions.height)

  const bounds = wrapper.append("g")
      .style("transform", `translate(${dimensions.margin.left}px, ${dimensions.margin.top}px)`)

  const defs = bounds.append("defs")

  // create scales
  const yScale = d3.scaleLinear()
    .domain(d3.extent(dataset, yAccessor))
    .range([dimensions.boundedHeight, 0])
    .nice()

  const xScale = d3.scaleTime()
    .domain(d3.extent(dataset, xAccessor))
    .range([0, dimensions.boundedWidth])

  // create grid marks
  const yAxisGeneratorGridMarks = d3.axisLeft(yScale)
      .ticks()
      .tickSize(-dimensions.boundedWidth)
      .tickFormat("")

  const yAxisGridMarks = bounds.append("g")
      .attr("class", "y-axis-grid-marks")
    .call(yAxisGeneratorGridMarks)

  // draw the line
  const lineGenerator = d3.area()
    .x(d => xScale(xAccessor(d)))
    .y(d => yScale(yAccessor(d)))

  const line = bounds.append("path")
      .attr("class", "line")
      .attr("d", lineGenerator(dataset))

  // draw axes
  const yAxisGenerator = d3.axisLeft()
    .scale(yScale)
    .ticks()

  const yAxis = bounds.append("g")
      .attr("class", "y-axis")
    .call(yAxisGenerator)

  const yAxisLabel = yAxis.append("text")
      .attr("y", -dimensions.margin.left + 10)
      .attr("x", -dimensions.boundedHeight / 2)
      .attr("class", "y-axis-label")
      .text("Atmospheric pressure")

  const xAxisGenerator = d3.axisBottom()
    .scale(xScale)
    .ticks()

  const xAxis = bounds.append("g")
      .attr("class", "x-axis")
      .style("transform", `translateY(${dimensions.boundedHeight}px)`)
    .call(xAxisGenerator)
}
drawLineChart()
