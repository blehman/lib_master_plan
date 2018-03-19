function Scroller(){
  var containerID = "scroller"
    , width
    , height;

  function chart(selection){
    // note: selection is passed in from the .call(iChartType), which is the same as myHeatmap(d3.select('.stuff')) -- ??
    selection.each(function(dataObject){
      // identify viz
      var viz = d3.select("body");
      var scroll = d3.select("#scrollContent");
      viz.on("wheel", function() {
        scroll.property("scrollTop", +scroll.property("scrollTop") + d3.event.deltaY)
      });



      d3.select("#scrollContent")
        .on("scroll",scrolling);

      var startPos
        , sections = d3.selectAll(".step")
        , sectionPositions = [];;
      sections.each(function(d,i) {
        var top = this.getBoundingClientRect().top;

        if(i === 0) {
          startPos = top;
        }
        sectionPositions.push(top - startPos);
        console.log(this.getBoundingClientRect())
      });

      console.log(sectionPositions)
      // get category names
      categoryNames = d3.keys(dataObject.costs);


      function scrolling(){

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
  chart.containerID = function(c) {
    if (!arguments.length) { return containerID; }
    containerID = c;
    return chart;
  };
  return chart
}
