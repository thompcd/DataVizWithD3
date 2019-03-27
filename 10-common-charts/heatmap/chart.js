async function drawScatter() {
  // load data
  let dataset = await d3.json("./../../../my_weather_data.json")

  // set data constants
  const parseDate = d3.timeParse("%Y-%m-%d")
  const dateAccessor = d => parseDate(d.date)
  dataset = dataset.sort((a,b) => dateAccessor(a) - dateAccessor(b))

  const firstDate = dateAccessor(dataset[0])
  const weekFormat = d3.timeFormat("%-e")
  const xAccessor = d => d3.timeWeeks(firstDate, dateAccessor(d)).length
  const dayOfWeekFormat = d3.timeFormat("%-w")
  const yAccessor = d => +dayOfWeekFormat(dateAccessor(d))
  const numericalDateAccessor = d => dateAccessor(d).getTime()

  const numberOfWeeks = Math.ceil(dataset.length / 7) + 1
  let dimensions = {
    margin: {
      top: 30,
      right: 0,
      bottom: 0,
      left: 80,
    },
  }
  dimensions.width = (window.innerWidth - dimensions.margin.left - dimensions.margin.right) * 0.95
  dimensions.boundedWidth = dimensions.width - dimensions.margin.left - dimensions.margin.right
  dimensions.height = dimensions.boundedWidth * 7 / numberOfWeeks + dimensions.margin.top + dimensions.margin.bottom
  dimensions.boundedHeight = dimensions.height - dimensions.margin.top - dimensions.margin.bottom

  // create chart area
  const wrapper = d3.select("#wrapper")
    .append("svg")
      .attr("width", dimensions.width)
      .attr("height", dimensions.height)

  const bounds = wrapper.append("g")
    .style("transform", `translate(${dimensions.margin.left}px, ${dimensions.margin.top}px)`)

  // create scales

  const barPadding = 0
  const totalBarDimension = d3.min([
    dimensions.boundedWidth / numberOfWeeks,
    dimensions.boundedHeight / 7,
  ])
  const barDimension = totalBarDimension - barPadding

  // draw labels
  const monthFormat = d3.timeFormat("%b")
  const months = bounds.selectAll(".month")
    .data(d3.timeMonths(dateAccessor(dataset[0]), dateAccessor(dataset[dataset.length - 1])))
    .enter().append("text")
      .attr("class", "month")
      .attr("transform", d => `translate(${totalBarDimension * d3.timeWeeks(firstDate, d).length}, -10)`)
      .text(d => monthFormat(d))

  const dayOfWeekParse = d3.timeParse("%-e")
  const dayOfWeekTickFormat = d3.timeFormat("%-A")
  const labels = bounds.selectAll(".label")
    .data(new Array(7).fill(null).map((d,i) => i))
    .enter().append("text")
      .attr("class", "label")
      .attr("transform", d => `translate(-10, ${totalBarDimension * (d + 0.5)})`)
      .text(d => dayOfWeekTickFormat(dayOfWeekParse(d)))

  const drawDays = (metric) => {
    d3.select("#metric")
      .text(metric)
    const colorAccessor = d => d[metric]
    const colorRangeDomain = d3.extent(dataset, colorAccessor)
    const colorRange = d3.scaleLinear()
      .domain(colorRangeDomain)
      .range([0, 1])
      .clamp(true)
    const colorGradient = d3.interpolateHcl("#ecf0f1", "#5758BB")
    const colorScale = d => colorGradient(colorRange(d) || 0)

    d3.select("#legend-min")
      .text(colorRangeDomain[0])
    d3.select("#legend-max")
      .text(colorRangeDomain[1])
    d3.select("#legend-gradient")
      .style("background", `linear-gradient(to right, ${
        new Array(10).fill(null).map((d, i) => (
          `${colorGradient(i / 9)} ${i * 100 / 9}%`
        )).join(", ")
      })`)

    // draw the points
    const days = bounds.selectAll(".day")
      .data(dataset, d => d.date)

    const newDays = days.enter().append("rect")

    const allDays = newDays.merge(days)
        .attr("class", "day")
        .attr("x", d => totalBarDimension * xAccessor(d))
        .attr("width", barDimension)
        .attr("y", d => totalBarDimension * yAccessor(d))
        .attr("height", barDimension)
        .style("fill", d => colorScale(colorAccessor(d)))

    const oldDots = days.exit()
        .remove()
  }

  const metrics = [
    "moonPhase",
    "windSpeed",
    "dewPoint",
    "humidity",
    "uvIndex",
    "windBearing",
    "temperatureMin",
    "temperatureMax",
  ]
  let selectedMetricIndex = 0
  drawDays(metrics[selectedMetricIndex])

  const button = d3.select("#heading")
    .append("button")
      .text("Change metric")

  button.node().addEventListener("click", onClick)
  function onClick() {
    selectedMetricIndex = (selectedMetricIndex + 1) % (metrics.length - 1)
    drawDays(metrics[selectedMetricIndex])
  }

  // const xAxisGenerator = d3.axisBottom()
  //   .scale(xScale)

  // const xAxis = bounds.append("g")
  //   .call(xAxisGenerator)
  //     .style("transform", `translateY(${dimensions.boundedHeight}px)`)

  // const xAxisLabel = xAxis.append("text")
  //     .attr("class", "x-axis-label")
  //     .attr("x", dimensions.boundedWidth / 2)
  //     .attr("y", dimensions.margin.bottom - 10)
  //     .html("dew point (&deg;F)")

  // const yAxisGenerator = d3.axisLeft()
  //   .scale(yScale)
  //   .ticks(4)

  // const yAxis = bounds.append("g")
  //   .call(yAxisGenerator)

  // const yAxisLabel = yAxis.append("text")
  //     .attr("class", "y-axis-label")
  //     .attr("x", -dimensions.boundedHeight / 2)
  //     .attr("y", -dimensions.margin.left + 10)
  //     .text("relative humidity")
}
drawScatter()