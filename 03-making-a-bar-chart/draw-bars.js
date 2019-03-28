async function drawScatter() {
  // *********************************
  // Enter your code after each step!
  // *********************************

  //1. Access Data -
  //Look at the data structure and declare how to access the values we'll need

  const dataset = await d3.json("./../my_weather_data.json")
  const metricAccessor = d => d.humidity
  const yAccessor = d => d.length

  const mean = d3.mean(dataset, metricAccessor)

  //2. Create Chart Dimensions -
  //Declare the physical (i.e. pixels) chart parameters

  const width = 500

  let dimensions = {
    width: width,
    height: width * .6,
    margin:{
      top: 30,
      right: 10,
      bottom: 50,
      left: 50,
    },
  }

  dimensions.boundedHeight = dimensions.height - dimensions.margin.top - dimensions.margin.bottom
  dimensions.boundedWidth = dimensions.width - dimensions.margin.left - dimensions.margin.right


  //3. Create Canvas -
  //Render the chart area and bounds element

  let wrapper = d3.select("#wrapper")
    .append("svg")
      .attr("width", dimensions.width)
      .attr("height", dimensions.height)

    const bounds = wrapper.append("g")
      .style("transform", `translate(${dimensions.margin.left}px, ${dimensions.margin.top}px)`)

  //4. Create Scales -
  //Create scales for every data-to-physical attribute in our chart

  const xScale = d3.scaleLinear()
    .domain(d3.extent(dataset, metricAccessor))
    .range([0, dimensions.boundedWidth])
    .nice()

    const binsGenerator = d3.histogram()
      .domain(xScale.domain())
      .value(metricAccessor)
      .thresholds(12)

    const bins = binsGenerator(dataset)

    console.log(bins)

  const yScale = d3.scaleLinear()
    .domain([0, d3.max(bins, yAccessor)])
    .range([dimensions.boundedHeight, 0])
    .nice()

  const binGroups = bounds.selectAll("g")
    .data(bins)
  .enter().append("g")

  //5. Draw Data
  //Render your data elements

  const firstBin = bins[1]
  const barWidth = xScale(firstBin.x1) - xScale(firstBin.x0)
  const barPadding = 1

  const barRects = binGroups.append("rect")
    .attr("x", d => xScale(d.x0) + barPadding)
    .attr("y", d => yScale(yAccessor(d)))
    .attr("width", barWidth - barPadding)
    .attr("height", d => dimensions.boundedHeight - yScale(yAccessor(d)))
    .attr("fill", "cornflowerblue")

  const meanLine = bounds
    .append("line")
      .attr("x1", xScale(mean))
      .attr("x2", xScale(mean))
      .attr("y1", -20)
      .attr("y2", dimensions.boundedHeight)
      .attr("stroke", "maroon")
      .attr("stroke-dasharray", "2px 4px")


  //6. Draw Peripherals
  //Render your axes, labels and legends

  const barText = binGroups.filter(yAccessor)
    .append("text")
      .attr("x", d => xScale(d.x0) + barWidth / 2)
      .attr("y", d => yScale(yAccessor(d)) - 5)
      .text(yAccessor)
      .style("text-anchor", "middle")
      .attr("fill", "darkgrey")
      .style("font-size", "12px")
      .style("font-family", "sans-serif")

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
      .text("Humidity")




  //!!! Step 7 not covered until Chapter 5 !!!
  //7. Set Up Interactions
  //Initialize event listeners for interaction
}
drawScatter()
