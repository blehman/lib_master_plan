
function Bubbles(){
  var innerPadding = .30
    , width = 500
    , height = 200
    , labelScale = d3.scaleBand().paddingInner(innerPadding).paddingOuter(0.50)
    , rectScale = d3.scaleBand().padding(innerPadding/2)
    , categoryNames
    , heightScale = d3.scaleLinear().range([height, 0])
    , viz
    , colorScale = d3.scaleOrdinal().range(["#80bd88", "#d3b67c", "#5eaec0"])
    , radiusScale = d3.scaleLinear().range([1,6]).clamp(true)
    , simulation
    , nodes;

  function chart(selection){
    // note: selection is passed in from the .call(iChartType), which is the same as myHeatmap(d3.select('.stuff')) -- ??
    selection.each(function(dataObject){
      console.log(dataObject)
      // identify viz
      svg = d3.select("#viz")
        .append("g")
        .attr("id","bubbles-container");
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

      // radius scale
      //radiusScale.domain(d3.extent(dataObject.bubbles,d=>d.amount))
      radiusScale.domain([0,800])
      console.log(radiusScale.domain())

      // isolate forces
      function isolate(force, filter) {
        var initialize = force.initialize;
        force.initialize = function() { initialize.call(force, dataObject.bubbles.filter(filter)); };
        return force;
      }
      // create cancelation force
      function forceZero(alpha) {
        for (var i = 0, n = nodes.length, node, k = alpha; i < n; ++i) {
          node = nodes[i];
          node.vx =0;
          node.vy =0;
        }
      }
      //create forceSimulation
      simulation = d3.forceSimulation()
            .nodes(dataObject.bubbles) // adds an x & y attribute to the data
            .force("x", d3.forceX(function(d) {
              var start = labelScale(d.year)
                , adj = rectScale(d.cost_label)
                , bandwidth = rectScale.bandwidth();
              return start+adj+(bandwidth/2.0); }).strength(1))
            .force("y", d3.forceY(function(d){
              return heightScale(d.amount);
            }))
            .force("collide", d3.forceCollide().radius(10))
            .force("manyBody", d3.forceManyBody().strength(-10))
            .on("tick", ticked);
            //.stop();

      nodes = svg.selectAll("circle")
            .data(dataObject.bubbles)
            .enter()
            .append("circle")
            .attr("class", d => "indv-cost "+d.cost_label.replace(/\ /g,"-"))
            .style("fill",d => colorScale(d.cost_label))
            .attr("name",d => d.name)
            .style("stroke-width", 2)
            .attr("r",d=>radiusScale(d.amount))
            .attr("opacity",1)
            .attr("stroke","white")
            .attr("stroke-opacity",0.5)
            .attr("fill-opacity",1.0);

      function ticked(){
        // nodes are bounded by size of the svg
        nodes
          .attr("cx", function(d) {
            var start = labelScale(d.year)
              , adj = rectScale(d.cost_label)
              , bandwidth = rectScale.bandwidth();
            return d.x = Math.max(start+adj+radiusScale(d.amount)+1, Math.min(start+adj+bandwidth - radiusScale(d.amount)-1, d.x));} )
          .attr("cy", function(d) {
            return d.y = Math.min(height-radiusScale(d.amount)-1, Math.max(heightScale(dataObject.total_lookup[d.cost_label+"-"+d.year]) + radiusScale(d.amount) + 1, d.y));}
          )
      }
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
  return chart
}
