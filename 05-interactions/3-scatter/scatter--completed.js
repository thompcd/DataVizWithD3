async function drawScatter() {
  // load data
  const dataset = await d3.json("./../../my_weather_data.json")

  // set data constants
  const xAccessor = d => d.dewPoint
  const yAccessor = d => d.humidity

  const width = d3.min([
    window.innerWidth * 0.9,
    window.innerHeight * 0.9,
  ])
  let dimensions = {
    width: width,
    height: width,
    margin: {
      top: 10,
      right: 10,
      bottom: 50,
      left: 50,
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

  // create scales
  const xScale = d3.scaleLinear()
    .domain(d3.extent(dataset, xAccessor))
    .range([0, dimensions.boundedWidth])
    .nice()

  const yScale = d3.scaleLinear()
    .domain(d3.extent(dataset, yAccessor))
    .range([dimensions.boundedHeight, 0])
    .nice()

  const drawDots = (dataset) => {
    // draw the points
    const dots = bounds.selectAll("circle")
      .data(dataset, d => d[0])

    const newDots = dots.enter().append("circle")

    const allDots = newDots.merge(dots)
        .attr("cx", d => xScale(xAccessor(d)))
        .attr("cy", d => yScale(yAccessor(d)))
        .attr("r", 4)

    const oldDots = dots.exit()
        .remove()
  }
  drawDots(dataset)

  // draw axes
  const xAxisGenerator = d3.axisBottom()
    .scale(xScale)

  const xAxis = bounds.append("g")
    .call(xAxisGenerator)
      .style("transform", `translateY(${dimensions.boundedHeight}px)`)

  const xAxisLabel = xAxis.append("text")
      .attr("class", "x-axis-label")
      .attr("x", dimensions.boundedWidth / 2)
      .attr("y", dimensions.margin.bottom - 10)
      .html("dew point (&deg;F)")

  const yAxisGenerator = d3.axisLeft()
    .scale(yScale)
    .ticks(4)

  const yAxis = bounds.append("g")
      .call(yAxisGenerator)

  const yAxisLabel = yAxis.append("text")
      .attr("class", "y-axis-label")
      .attr("x", -dimensions.boundedHeight / 2)
      .attr("y", -dimensions.margin.left + 10)
      .text("relative humidity")


  const voronoiGenerator = d3.voronoi()
      .x(d => xScale(xAccessor(d)))
      .y(d => yScale(yAccessor(d)))
      .extent([
        [0, 0],
        [dimensions.boundedWidth, dimensions.boundedHeight]
      ])

  const voronoiPolygons = voronoiGenerator.polygons(dataset)

  bounds.selectAll(".voronoi")
    .data(voronoiPolygons)
      .enter().append("polygon")
      .attr("class", "voronoi")
      .attr("points", (d=[]) => (
        d.map(point => (
          point.join(",")
        )).join(" ")
      ))
      // .attr("stroke", "grey")
      .on("mouseenter", onMouseEnter)
      .on("mouseleave", onMouseLeave)

  const tooltip = d3.select("#tooltip")
  function onMouseEnter(voronoiDatum) {
    const datum = voronoiDatum.data

    const dayDot = bounds.append("circle")
        .attr("class", "tooltipDot")
        .attr("cx", d => xScale(xAccessor(datum)))
        .attr("cy", d => yScale(yAccessor(datum)))
        .attr("r", 7)
        .style("fill", "maroon")
        .style("pointer-events", "none")

    // d3.selectAll("circle")
      // .filter(d => d == datum)
      // .style("fill", "maroon")

    const formatHumidity = d3.format(".2f")
    tooltip.select("#humidity")
        .text(formatHumidity(yAccessor(datum)))

    const formatDewPoint = d3.format(".2f")
    tooltip.select("#dew-point")
        .text(formatDewPoint(xAccessor(datum)))

    const dateParser = d3.timeParse("%Y-%m-%d")
    const formatDate = d3.timeFormat("%B %A %-d, %Y")
    tooltip.select("#date")
        .text(formatDate(dateParser(datum.date)))

    const x = xScale(xAccessor(datum))
      + dimensions.margin.left
    const y = yScale(yAccessor(datum))
      + dimensions.margin.top

    tooltip.style("transform", `translate(`
      + `calc( -50% + ${x}px),`
      + `calc(-100% + ${y}px)`
      + `)`)

    tooltip.style("opacity", 1)
  }

  function onMouseLeave() {
    d3.selectAll(".tooltipDot")
      .remove()

    tooltip.style("opacity", 0)
  }
}
drawScatter()