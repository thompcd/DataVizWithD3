async function drawScatter() {
  // *********************************
  // Enter your code after each step!
  // *********************************

  //1. Access Data -
  //Look at the data structure and declare how to access the values we'll need

  const dataset = await d3.json("./../my_weather_data.json")
  console.table(dataset[0])

  const xAccessor = d => d.dewPoint
  const yAccessor = d => d.humidity
  const precipitationAccessor = d => d.precipType
  const probabilityAccessor = d => d.precipProbability

  //2. Create Chart Dimensions -
  //Declare the physical (i.e. pixels) chart parameters

  console.log(d3.max(dataset, probabilityAccessor))

  const width = d3.min([
    window.innerWidth * 0.95,
    window.innerHeight * 0.95,
  ])

  let dimensions = {
    width: width,
    height: width,
    margin: {
      top: 40,
      right: 10,
      bottom: 50,
      left: 50,
    },
  }

  dimensions.boundedWidth = dimensions.width - dimensions.margin.left - dimensions.margin.right
  dimensions.boundedHeight = dimensions.height - dimensions.margin.top - dimensions.margin.bottom

  //3. Create Canvas -
  //Render the chart area and bounds element

  const wrapper = d3.select("#wrapper")
    .append("svg")
      .attr("width", dimensions.width)
      .attr("height", dimensions.height)

  const bounds = wrapper.append("g")
      .style("transform", `translate(${dimensions.margin.left}px, ${dimensions.margin.top}px)`)
  //4. Create Scales -
  //Create scales for every data-to-physical attribute in our chart

  const xScale = d3.scaleLinear()
    .domain(d3.extent(dataset, xAccessor))
    .range([0, dimensions.boundedWidth])
    .nice()

  const yScale = d3.scaleLinear()
    .domain(d3.extent(dataset, yAccessor))
    .range([dimensions.boundedHeight, 0])
    .nice()

  const colorScale = d3.scaleOrdinal()
    .domain(["rain", "snow"])
    .range(["cornflowerblue", "lightgrey"])


   // const dotLinearScale = d3.scaleLinear()
   //   .domain(d3.extent(dataset, probabilityAccessor))
   //   .range([0.00001, d3.max(dataset, probabilityAccessor)])

   const dotSizeScale = d3.scaleSymlog()
     .domain(d3.extent(dataset, probabilityAccessor))
     .range([1.5, 5])

  console.log(dotSizeScale(0.5))
  //5. Draw Data
  //Render your data elements

  // function drawDots(dataset, color) {
  //   const dots = bounds.selectAll("circle")
  //     .data(dataset)

      const dots = bounds.selectAll("circle")
        .data(dataset)
        .enter().append("circle")
          .attr("cx", d => xScale(xAccessor(d)))
          .attr("cy", d => yScale(yAccessor(d)))
          .attr("r", d => dotSizeScale(probabilityAccessor(d)))
          .attr("fill", d => colorScale(precipitationAccessor(d)))

    // dots.enter().append("circle")
    //   .merge(dots)
    //     .attr("cx", d => xScale(xAccessor(d)))
    //     .attr("cy", d => yScale(yAccessor(d)))
    //     .attr("r" , d => dotSizeScale(probabilityAccessor(d)))
    //     .attr("fill", d => colorScale(precipitationAccessor(d)))
  //}
  // drawDots(dataset.slice(0, 200), "darkgrey")

  // setTimeout(() => {
  //   drawDots(dataset, "cornflowerblue")
  // }, 1000)

  //6. Draw Peripherals
  //Render your axes, labels and legends

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
    .html("dew point (&deg;F)")

  const yAxisGenerator = d3.axisLeft()
    .scale(yScale)

  const yAxis = bounds.append("g")
    .call(yAxisGenerator)

  const yAxisLabel = yAxis.append("text")
    .attr("x", -dimensions.boundedHeight / 2)
    .attr("y", -dimensions.margin.left + 10)
    .attr("fill", "black")
    .style("font-size", "1.4em")
    .text("relative humidity")
    .style("transform", "rotate(-90deg)")
    .style("text-anchor", "middle")

    d3.select("#wrapper svg")
      .append("g")
      .append("text")
      .attr("x", dimensions.boundedWidth / 2 + 50)
      .attr("y", 20 )
      .style("text-anchor", "middle")
      .style("font-size", "20px")
      .style("text-decoration", "underline")
      .text("Dew Point vs Humidity in Tulsa, OK");
  //!!! Step 7 not covered until Chapter 5 !!!
  //7. Set Up Interactions
  //Initialize event listeners for interaction

}
drawScatter()
