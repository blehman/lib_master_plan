
(function() {
  // call the heatmap constructor
  var iBubbles = Bubbles()
    , iBarChart = BarChart();

  // get data
  d3.queue()
    .defer(d3.json, "data/expense_data.json")
    .defer(d3.csv, "data/yearly_totals_per_cost_category.csv")
    .defer(d3.json,"data/bubbles.json")
    .defer(d3.json,"data/yearCategory_total_lookup.json")
    //.defer(d3.json,"data/year_index.json")
    .await(runApp);

  function runApp(error,expenses, totals, bubbles, total_lookup){
    if (error) throw error;

    var full_set = [{
      "years":expenses.years
      , "costs":expenses.costs
      , "totals": totals
      , "bubbles": bubbles
      , "total_lookup":total_lookup
    }]

    var container = d3.select(".viz-container");

    var viz_width = container.node().getBoundingClientRect().width
      , viz_height = container.node().getBoundingClientRect().height;

    // set measurements
    d3.select("#viz")
      .attr("preserveAspectRatio","xMinYMin meet")
      .attr("viewBox","-60 -12 " + viz_width*1.10+ " " +viz_height*1.15)
    console.log(viz_width)
    console.log(viz_height)

    iBarChart.width(viz_width)
    iBarChart.height(viz_height)
    iBubbles.width(viz_width)
    iBubbles.height(viz_height)
    container.select("svg").selectAll("#barChart-container")
      .data(full_set)
      .enter()
      .append("g")
      .attr('id',"barChart-container")
      .call(iBarChart);
    container.select("svg").selectAll("#bubbles-container")
      .data(full_set)
      .enter()
      .append("g")
      .attr('id',"bubbles-container")
      .call(iBubbles);
    window.addEventListener("resize", function(){
      //wtf
    });
  }
}())
