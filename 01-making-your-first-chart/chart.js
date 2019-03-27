async function drawLineChart() {
  const dataset = await d3.json("./../my_weather_data.json")
  console.log(dataset[0])

  const yAccessor = d => d.temperatureMax
  //const xAccessor = d => d.date
  const dateParser = d3.timeParse("%Y-%m-%d")
  const xAccessor = d => dateParser(d.date)

  //console.log(yAccessor(dataset[0]))
  console.log(xAccessor(dataset[0]))

  let dimensions = {
    width: window.innerWidth * 0.9,
    height: 400,
    margin: {
      top: 30,
      right: 15,
      bottom: 40,
      left: 60,
    },
  }

  dimensions.boundedWidth = dimensions.width - dimensions.margin.left - dimensions.margin.right
  dimensions.boundedHeight = dimensions.height - dimensions.margin.top - dimensions.margin.bottom

  const wrapper = d3.select("#wrapper")
    .append("svg")
    .attr("width", dimensions.width)
    .attr("height", dimensions.height)

  const bounds = wrapper.append("g")
    .style("transform", `translate(${dimensions.margin.left}px, ${dimensions.margin.top}px)`)

  const yScale = d3.scaleLinear()
    .domain(d3.extent(dataset, yAccessor))
    .range([dimensions.boundedHeight, 0])

  const freezingTemperaturePlacement = yScale(32)
  const freezingTemperatures = bounds.append("rect")
    .attr("x", 0)
    .attr("width", dimensions.boundedWidth)
    .attr("y", freezingTemperaturePlacement)
    .attr("height", dimensions.boundedHeight - freezingTemperaturePlacement)
    .attr("fill", "#e0f3f3")

  const xScale = d3.scaleTime()
    .domain(d3.extent(dataset, xAccessor))
    .range([0, dimensions.boundedWidth])

  const lineGenerator = d3.line()
    .x(d => xScale(xAccessor(d)))
    .y(d => yScale(yAccessor(d)))

  const line = bounds.append("path")
    .attr("d", lineGenerator(dataset))
    .attr("fill", "none")
    .attr("stroke", "#af9358")
    .attr("stroke-width", 2)

//create axes
  const yAxisGenerator = d3.axisLeft()
    .scale(yScale)
  const yAxis = bounds.append("g")
    .call(yAxisGenerator)

  const xAxisGenerator = d3.axisBottom()
    .scale(xScale)
  const xAxis = bounds.append("g")
    .call(xAxisGenerator)
      .style("transform", `translateY(${dimensions.boundedHeight}px)`)

  d3.select("#wrapper svg")
    .append("g")
    .append("text")
    .attr("x", dimensions.boundedWidth / 2)
    .attr("y", 20 )
    .style("text-anchor", "middle")
    .style("font-size", "20px")
    .style("text-decoration", "underline")
    .text("Daily Max Temperature in Tulsa, OK");

}
drawLineChart()
