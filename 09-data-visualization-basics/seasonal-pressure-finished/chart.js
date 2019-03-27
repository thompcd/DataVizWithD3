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
  const downsampledData = weeks.map((week, index) => {
    const weekEnd = weeks[index + 1] || new Date()
    const days = dataset.filter(d => xAccessor(d) > week && xAccessor(d) <= weekEnd)
    return {
      date: dateFormatter(week),
      pressure: d3.mean(days, yAccessor),
    }
  })

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

  const gradientId = "timeline-gradient"
  const gradient = defs.append("linearGradient")
      .attr("id", gradientId)
      .attr("x1", "0%")
      .attr("x2", "0%")
      .attr("y1", "0%")
      .attr("y2", "100%")
      .attr("spreadMethod", "pad")

  const stops = ["#34495e", "#c8d6e5", "#34495e"]
  stops.forEach((stop, i) => {
      gradient.append('stop')
          .attr('offset', `${i * 100 / (stops.length - 1)}%`)
          .attr('stop-color', stop)
          .attr('stop-opacity', 1)
  })

  // create scales
  const yScale = d3.scaleLinear()
    .domain(d3.extent(downsampledData, yAccessor))
    .range([dimensions.boundedHeight, 0])
    .nice(5)

  const xScale = d3.scaleTime()
    .domain(d3.extent(downsampledData, xAccessor))
    .range([0, dimensions.boundedWidth])

  // add season elements
  const seasonBoundaries = [
    "2016-12-21",
    "2017-3-20",
    "2017-6-21",
    "2017-9-21",
    "2017-12-21",
  ]
  const seasonOffset = 10
  const seasons = bounds.selectAll(".season")
      .data(seasonBoundaries)
    .enter().append("rect")
      .attr("x", d => d3.max([0, xScale(dateParser(d))]))
      .attr("width", (d, i) =>
        seasonBoundaries[i + 1]
          ? xScale(dateParser(seasonBoundaries[i + 1])) - d3.max([0, xScale(dateParser(d))])
          : dimensions.boundedWidth - xScale(dateParser(d))
      )
      .attr("y", seasonOffset)
      .attr("height", dimensions.boundedHeight - seasonOffset)
      .attr("class", "season")

  const seasonData = seasonBoundaries.map((boundary, index) => {
    const boundaryStart = d3.max([xAccessor(downsampledData[0]), dateParser(boundary)])
    const boundaryEnd = seasonBoundaries[index + 1] ? dateParser(seasonBoundaries[index + 1]) : xAccessor(downsampledData[downsampledData.length - 1])
    const days = dataset.filter(d => xAccessor(d) > boundaryStart && xAccessor(d) <= boundaryEnd)
    return {
      start: boundaryStart,
      end: boundaryEnd,
      mean: d3.mean(days, yAccessor),
    }
  })

  // draw the line
  const areaGenerator = d3.area()
    .x(d => xScale(xAccessor(d)))
    .y0(dimensions.boundedHeight / 2)
    .y1(d => yScale(yAccessor(d)))
    // .curve(d3.curveBasis)

  const area = bounds.append("path")
      .attr("class", "area")
      .attr("d", areaGenerator(downsampledData))
      .style("fill", "url(#timeline-gradient)")

  const lineGenerator = d3.area()
    .x(d => xScale(xAccessor(d)))
    .y(d => yScale(yAccessor(d)))
    // .curve(d3.curveBasis)

    // const dots = bounds.selectAll(".dot")
    // .data(downsampledData)
    // .enter().append("circle")
    // .attr("cx", d => xScale(xAccessor(d)))
    // .attr("cy", d => yScale(yAccessor(d)))
    // .attr("r", 3)
    // .attr("class", "dot")
    // .attr("opacity", "0.2")
  const line = bounds.append("path")
      .attr("class", "line")
      .attr("d", lineGenerator(downsampledData))

  const seasonMeans = bounds.selectAll(".season-mean")
      .data(seasonData)
    .enter().append("line")
      .attr("x1", (d, i) => i ? xScale(d.start) : -10)
      .attr("x2", d => xScale(d.end))
      .attr("y1", d => yScale(d.mean))
      .attr("y2", d => yScale(d.mean))
      .attr("class", "season-mean")
  const seasonMeanLabel = bounds.append("text")
    .attr("x", -15)
    .attr("y", yScale(seasonData[0].mean))
    .attr("class", "season-mean-label")
    .text("Season mean")

  const seasonNames = ["Winter", "Spring", "Summer", "Fall"]
  const seasonLabels = bounds.selectAll(".season-label")
      .data(seasonBoundaries.slice(0, -1))
    .enter().append("text")
      .attr("x", (d, i) =>
        seasonBoundaries[i + 1]
        ? d3.mean([xScale(dateParser(seasonBoundaries[i + 1])), d3.max([0, xScale(dateParser(d))])])
        : xScale(dateParser(d)) + 20
      )
      .attr("y", dimensions.boundedHeight + 30)
      .text((d, i) => seasonNames[i])
      .attr("class", "season-label")

  // draw axes
  const yScaleDomain = yScale.domain()
  const yAxisLabels = [
    yScaleDomain[0],
    d3.mean(yScaleDomain),
    yScaleDomain[1],
  ]
  const formatNumber = d3.format(",.0f")
  const yAxisLabelElems = bounds.selectAll(".y-axis-label")
      .data(yAxisLabels)
    .enter().append("text")
      .attr("x", -15)
      .attr("y", yScale)
      .text(formatNumber)
      .attr("class", "y-axis-label")

  const yAxisLabelTicks = bounds.selectAll(".y-axis-tick")
      .data(yAxisLabels.slice(0, -1))
    .enter().append("line")
      .attr("x1", -8)
      .attr("x2", 0)
      .attr("y1", yScale)
      .attr("y2", yScale)
      .attr("class", "y-axis-tick")

  const yAxisLabelSuffix = bounds.append("text")
      .attr("x", -8)
      .attr("y", 0)
      .text("hectopascals of atmospheric pressure")
      .attr("class", "y-axis-label y-axis-label-suffix")

  const yAxisLabelMean = bounds.append("text")
      .attr("x", -15)
      .attr("y", dimensions.boundedHeight / 2 + 20)
      .text("Year mean")
      .attr("class", "y-axis-label y-axis-label-mean")


      bounds.append("line")
      .attr("x1", 0)
      .attr("x2", dimensions.boundedWidth)
      .attr("y1", dimensions.boundedHeight / 2)
      .attr("y2", dimensions.boundedHeight / 2)
      .attr("class", "y-axis-tick-2")

}
drawLineChart()
