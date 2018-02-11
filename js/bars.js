
function BarChart(){
  var innerPadding = .30
    , width = 500
    , height = 200
    , labelScale = d3.scaleBand().paddingInner(innerPadding).paddingOuter(0.50)
    , rectScale = d3.scaleBand().padding(innerPadding/2)
    , bandwidth
    , categoryNames
    //, yearlyTotals=[0,0,0,0,0];
    , heightScale = d3.scaleLinear().range([height, 0])
    , viz
    , colorScale = d3.scaleOrdinal().range(["#80bd88", "#d3b67c", "#5eaec0"]);

  function chart(selection){
    // note: selection is passed in from the .call(iChartType), which is the same as myHeatmap(d3.select('.stuff')) -- ??
    selection.each(function(dataObject){
      console.log(dataObject)
      // identify viz
      svg = d3.select("#viz")
        .append("g")
        .attr("id","barChart-container");
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
            var containsYear = function(element){
              return (+element.year) == d};
            var x = dataObject.totals.filter(containsYear)
            return dataObject.totals.filter(containsYear)})
          .enter().append("rect")
            .attr("class",d=>"agg-cost-bar "+d.cost_category+"-"+d.year)
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

        svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(labelScale));
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
