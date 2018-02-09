
function BubbleChart(){
  var innerPadding = .30
    , width = 800
    , height = 400
    , labelScale = d3.scaleBand().paddingInner(innerPadding).paddingOuter(0.50)
    , rectScale = d3.scaleBand().padding(innerPadding/2)
    , bandwidth
    , categoryNames
    //, yearlyTotals=[0,0,0,0,0];
    , heightScale = d3.scaleLinear().rangeRound([height, 0])
    , viz
    , colorScale = d3.scaleOrdinal().range(["#80bd88", "#d3b67c", "#5eaec0"]);

  function chart(selection){
    // note: selection is passed in from the .call(iChartType), which is the same as myHeatmap(d3.select('.stuff')) -- ??
    selection.each(function(dataObject){
      console.log(dataObject)
      // identify viz
      svg = d3.select("#viz")
      // get category names
      categoryNames = d3.keys(dataObject.costs);

      // define labelScale
      labelScale.domain(dataObject.years)
        .rangeRound([0,width*0.8])

      // define rectScale
      rectScale.domain(categoryNames)
        .rangeRound([0,labelScale.bandwidth()]);

      // set domain for height
      heightScale.domain(d3.extent(dataObject.totals, d => +d.value))

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
            //console.log(d)
            var containsYear = function(element){
              return (+element.year) == d};
            var x = dataObject.totals.filter(containsYear)
            return dataObject.totals.filter(containsYear)})
          .enter().append("rect")
            .attr("x", function(d) {
              //console.log(d)
              return rectScale(d.cost_category); })
            .attr("y", function(d) { return heightScale(d.value); })
            .attr("value",d=>d.value)
            .attr("year",d=>d.year)
            .attr("width", rectScale.bandwidth())
            .attr("height", function(d) { return height - heightScale(d.value); })
            .attr("fill", function(d) {
              return colorScale(d.cost_category); });
      //
      // get totalsx`
      /*
      d3.entries(dataObject.costs).forEach(function(d,i){
        var cat = d.key
          , values = d.value;
        yearlyTotals=[0,0,0,0,0]
        d3.entries(values).forEach(function(d2,i2){
          yearlyTotals = yearlyTotals.map(function(runningTotal,runningIndex){
            console.log(d2)
            if (d2.key!="_factor"){
              return runningTotal+d2.value[runningIndex]
            }
          })
        })
        console.log(yearlyTotals)
      })
      */

    // end selection
    })
  // end chart
  }

  chart.anything = function(x) {
    if (!arguments.length) { return anything; }
    anything = x;
    return chart;
  };

  return chart
}
