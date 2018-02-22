
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

    // draw initial viz
    reDraw();
    var run;
    window.onresize = function() {
        clearTimeout(run);
        run = setTimeout(function() {
            reDraw();
        }, 100);
    };


    function reDraw(){
      var container = d3.select(".viz-container");
      var width = container.node().getBoundingClientRect().width
        , height = container.node().getBoundingClientRect().height
        , margin = {top: 20, right: 10, bottom: 30, left: 30}
        , viz_width = width - margin.left - margin.right
        , viz_height = height - margin.top - margin.bottom

        //, k = (viz_width/687.96875*1.10) // ideal ratio
        //, left_margin = (k>=1)?60:60*k;
        //console.log(viz_width)
        //console.log(viz_height)
        //d3.select("#viz")
          //.attr("preserveAspectRatio","xMinYMin meet")
          //.attr("viewBox","-60 -12 " + (viz_width*1.10+60)+ " " +(viz_height*1.15+12))
      iBarChart.width(viz_width)
      iBarChart.height(viz_height)
      iBubbles.width(viz_width)
      iBubbles.height(viz_height)
      // remove all children in svg
      container.select("svg").selectAll("*").remove()
      // build margins on svg & add svg-elments-container
      container.select("svg")
        .attr("width", viz_width + margin.left + margin.right)
        .attr("height", viz_height + margin.top + margin.bottom)
        .append("g")
        .attr("id","svg-elements-container")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      // draw barChart
      d3.select("#svg-elements-container").selectAll("#barChart-container")
        .data(full_set)
        .enter()
        .append("g")
        .attr('id',"barChart-container")
        .call(iBarChart);
      // draw bubbles
      d3.select("#svg-elements-container").selectAll("#bubbles-container")
        .data(full_set)
        .enter()
        .append("g")
        .attr('id',"bubbles-container")
        .call(iBubbles);
    }
  }
}())
