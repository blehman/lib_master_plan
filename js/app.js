
(function() {
  // call the heatmap constructor
  var iBubbles = Bubbles()
    , iBarChart = BarChart()
    , iLegend = Legend()
    , iScroller = Scroller()
    , chartInstances = [iBubbles, iBarChart, iLegend, iScroller]
    , deets = {x:0,y:0,width:0,height:0};

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
        , margin = {top: 20, right: 10, bottom: 30, left: 37}
        , viz_width = width - margin.left - margin.right
        , viz_height = height - margin.top - margin.bottom
        , xAxisTicks = ((width<270)?0:4)
        , yAxisTickScale = d3.scaleLinear().domain([230,500]).range([2,9]).clamp(true)
        , yAxisTicks = yAxisTickScale(height)
        ;

      // setter function for all chart settings
      function setter(iChart){
        iChart.width(viz_width)
        iChart.height(viz_height)
        if ((iChart!=iLegend)&(iChart!=iScroller)){
          iChart.xAxisTicks(xAxisTicks)
          iChart.yAxisTicks(yAxisTicks)
        }
        return iChart;
      }

      // update appropriate settings
      chartInstances.map(setter)

      // function to convert screen coords to svg coords
      function svgPoint(element, x, y) {
        var svg = document.getElementById('viz')
          , pt = svg.createSVGPoint();

        pt.x = x;
        pt.y = y;

        return pt.matrixTransform(element.getScreenCTM().inverse());
      }
      // build instances container
      container.select("#viz").selectAll("*").remove()
      d3.select("#legend-container").selectAll("*").remove()
      // build margins on svg & add svg-elments-container

      container.select("svg")
        .attr("width", viz_width + margin.left + margin.right)
        .attr("height", viz_height + margin.top + margin.bottom)
        .append("g")
        .attr("id","svg-elements-container")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      // draw chartInstances
      chartInstances.forEach(function(iChart,i){
        if (iChart == iLegend){
          // add legend-svg
          d3.select("#"+iChart.containerID())
            .append("svg")
            .attr("id","legend-svg")
            .attr("height","100%")
            .attr("width","100%")
            .selectAll("g")
          .data(full_set)
            .enter().append("g")
            .attr("id","legend-bars-container")
            .call(iLegend);

        }else{
          // add elements to viz-svg
          d3.select("#svg-elements-container").selectAll("#"+iChart.containerID())
            .data(full_set)
            .enter()
            .append("g")
            .attr('id',iChart.containerID())
            .call(iChart);
        }
      })
    }
  }
}())
