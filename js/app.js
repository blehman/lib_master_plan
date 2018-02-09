
(function() {
  // call the heatmap constructor
  var iBubbleChart = BubbleChart();

  // get data
  d3.queue()
    .defer(d3.json, "data/expense_data.json")
    .defer(d3.csv, "data/yearly_totals_per_cost_category.csv")
    //.defer(d3.json,"data/year_index.json")
    .await(runApp);

  function runApp(error,expenses, totals){
    if (error) throw error;

    var full_set = [{
      "years":expenses.years
      , "costs":expenses.costs
      , "totals": totals
    }]

    var container = d3.select("#viz-container");
        container.selectAll("#spare-parts")
            .data(full_set)
            .enter()
            .append("div")
            .attr('id',"spare-parts")
            .call(iBubbleChart);
  }
}())
