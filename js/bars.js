
function BarChart(){
  var innerPadding = .30
    , width = 10
    , height = 200
    , labelScale
    , rectScale
    , bandwidth
    , categoryNames
    //, yearlyTotals=[0,0,0,0,0];
    , heightScale
    , viz
    , colorScale = d3.scaleOrdinal().range(["#80bd88", "#d3b67c", "#5eaec0"])
    , xAxisTicks
    , yAxisTicks
    , containerID = "barChart-container";

  function chart(selection){
    // note: selection is passed in from the .call(iChartType), which is the same as myHeatmap(d3.select('.stuff')) -- ??
    selection.each(function(dataObject){
      // identify viz
      svg = d3.select("#"+containerID);
      // get category names
      categoryNames = d3.keys(dataObject.costs);

      // define labelScale
      labelScale = d3.scaleBand()
        .paddingInner(innerPadding)
        .paddingOuter(0.50)
        .domain(dataObject.years)
        .rangeRound([0,width]);

      // define rectScale
      rectScale = d3.scaleBand()
        .padding(innerPadding/2)
        .domain(categoryNames)
        .rangeRound([0,labelScale.bandwidth()]);

      // set domain and range for height
      heightScale = d3.scaleLinear()
        .domain(d3.extent(dataObject.totals, d => +d.value))
        .range([height, 0]);

      // set domain for color
      colorScale.domain(categoryNames)

      // add rectangles to the graph
      svg.append("g")
          .classed("year-container",true)
          .selectAll("g")
          .data(dataObject.years)
          .enter().append("g")
            .attr("class",d => "year-"+d)
            .attr("transform", function(d) { return "translate(" + labelScale(d) + ",0)"; })
          .selectAll("rect")
          .data(function(d){
            var containsYear = function(element){
              return (+element.year) == d};
            var x = dataObject.totals.filter(containsYear)
            return dataObject.totals.filter(containsYear)})
          .enter().append("rect")
            .attr("class",d=>"agg-cost-bar "+d.cost_category.replace(/\ /g,"-")+"-"+d.year)
            .attr("x", function(d) {
              return rectScale(d.cost_category); })
            .attr("y", function(d) {
              var value = (+d.value==0)?heightScale(10000):heightScale(+d.value);
              return value;})
            .attr("value",d=>d.value)
            .attr("year",d=>d.year)
            .attr("width", rectScale.bandwidth())
            .attr("height", function(d) {
              var value = (+d.value==0)?(height-heightScale(10000)):(height - heightScale(+d.value));
              return value;})
            .attr("fill", function(d) {
              return colorScale(d.cost_category); });

        // add x-axis
        svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(labelScale).ticks(xAxisTicks,"s"));

        // add y-axis
        svg.append("g")
            .attr("class", "axis")
            .call(d3.axisLeft(heightScale).ticks(yAxisTicks,"s"))//.ticks(null, "s"))

    // end selection
    })
  // end chart
  }

  chart.width = function(w) {
    if (!arguments.length) { return width; }
    width = w;
    return chart;
  };
  chart.height = function(h) {
    if (!arguments.length) { return height; }
    height = h;
    return chart;
  };
  chart.yAxisTicks = function(y) {
    if (!arguments.length) { return yAxisTicks; }
    yAxisTicks = y;
    return chart;
  };
  chart.xAxisTicks = function(x) {
    if (!arguments.length) { return xAxisTicks; }
    xAxisTicks = x;
    return chart;
  };
  chart.containerID = function(c) {
    if (!arguments.length) { return containerID; }
    containerID = c;
    return chart;
  };
  return chart
}
