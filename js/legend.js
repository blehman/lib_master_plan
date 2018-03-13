function Legend(){
  var innerPadding = .80
    , legendContainerX
    , legendContainerY
    , legendContainerHeight
    , legendContainerWidth
    , width = 10
    , height = 200
    , labelScale
    , rectScale
    , bandwidth
    , categoryNames
    , heightScale
    , viz
    , colorScale = d3.scaleOrdinal().range(["#80bd88", "#d3b67c", "#5eaec0"])
    , xAxisTicks
    , yAxisTicks
    , containerID = "legend-container"
    , svg
    , legendBox
    , legendDeets = {
      x: "0"
      , y: "0"
      , widht: "0"
      , height: "0"
    };

  function chart(selection){
    // note: selection is passed in from the .call(iChartType), which is the same as myHeatmap(d3.select('.stuff')) -- ??
    selection.each(function(dataObject){
      // identify viz
      svg = d3.select("#legend-bars-container");
      // border rect

      // get category names
      categoryNames = d3.keys(dataObject.costs);
      // set domain for color
      colorScale.domain(categoryNames)

     // create legend bars
     // define labelScale
     labelScale = d3.scaleBand()
       .paddingInner(innerPadding)
       .paddingOuter(0.50)
       .domain(dataObject.years)
       .rangeRound([0,width]);

     // define rectScale
     bandWidth = d3.selectAll("#legend-container").node().getBoundingClientRect().height
     rectScale = d3.scaleBand()
       .padding(innerPadding/2)
       .domain(categoryNames)
       .rangeRound([0,bandWidth]);

     // add rectangles to the graph
     svg.append("g")
         .classed("legend-bars",true)
         .selectAll("g")
         .data(categoryNames)
       .enter().append("rect")
         .attr("id",d => d)
         .classed("agg-cost-bar",true)
         .attr("fill", d => colorScale(d) )
         .attr("x", "10px")
         .attr("y", d => rectScale(d) )
         .attr("width","20px")
         .attr("height",rectScale.bandwidth())

     svg.append("g")
         .classed("legend-bars-text",true)
         .selectAll("g")
         .data(categoryNames)
       .enter().append("text")
        .text(d => d.replace("Estimated",""))
        .attr("x", "50px")
        .attr("y", d => rectScale(d) + rectScale.bandwidth()/2 )
        .attr("dy", ".35em");


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
  chart.legendDeets = function(d){
    if (!arguments.length) { return legendDeets; }
    legendDeets = d;
    return chart;
  };
  chart.containerID = function(c) {
    if (!arguments.length) { return containerID; }
    containerID = c;
    return chart;
  };
  return chart
}
