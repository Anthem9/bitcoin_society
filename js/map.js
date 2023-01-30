// The svg
const width = document.getElementById('map-box').clientWidth,
height = width * 0.75,
svg = d3.select("#map-svg")    
  .attr("width", width)
  .attr("height", height);


// Map and projection
const path = d3.geoPath();
const projection = d3.geoMercator()
  .scale(70)
  .center([0,20])
  .translate([width / 2, height / 2]);

// Data and color scale
const data = new Map();
const colorScale = d3.scaleThreshold()
  // .domain([1000, 100000, 1000000, 3000000, 10000000, 50000000])
  .domain([-100 ,1, 10, 100, 1000,10000, 100000])
  .range(d3.schemeBlues[7]);

// Load external data and boot
// https://raw.githubusercontent.com/Anthem9/bitcoin_society/main/data/emissions.csv
Promise.all([
d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson"),
// d3.csv("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world_population.csv", function(d) {
//     data.set(d.code, +d.pop)
d3.csv("https://raw.githubusercontent.com/Anthem9/bitcoin_society/main/data/emissions.csv", function(d) {
  data.set(d.code, +d.d2019)
  
})]).then(function(loadData){
    let topo = loadData[0]

    // Define the div for the tooltip
    var tip = d3.select("#map").append("div")
    .attr("class", "tooltip")
    .style('position', 'absolute')
		.style('z-index', '25')
    .style("opacity", 0)
  .style("background-color", "white")
  .style("border", "solid")
  .style("border-width", "2px")
  .style("border-radius", "5px")
  .style("padding", "5px")
  


    let mouseOver = function(d,i) {
      d3.selectAll(".Country")
        .transition()
        .duration(200)
        .style("opacity", .5)
      d3.select(this)
        .transition()
        .duration(200)
        .style("opacity", .8)
        .style("stroke", "black")
      // console.log(data)
      console.log(d)
      console.log(i)
      // console.log(d3.pointer(d))
      tip.style("opacity", 1)
        .html( "Country name: "+ i.properties.name +"<br/> CO2 emission : " + i.total + "<br/>") 
        .style("left", (d3.pointer(d)[0] + "px"))
        .style("top", (d3.pointer(d)[1]+200 + "px"))
    }
  
    let mouseLeave = function(d) {
      d3.selectAll(".Country")
        .transition()
        .duration(200)
        .style("opacity", .8)
      d3.select(this)
        .transition()
        .duration(200)
        .style("stroke", "transparent")
      tip.style("opacity", 0)
    }
  
  // Draw the map
  svg.append("g")
    .selectAll("path")
    .data(topo.features)
    .enter()
    .append("path")
      // draw each country
      .attr("d", d3.geoPath()
        .projection(projection)
      )
      // set the color of each country
      .attr("fill", function (d) {
        d.total = data.get(d.id) || 0;
        return colorScale(d.total);
      })
      .style("stroke", "transparent")
      .attr("class", function(d){ return "Country" } )
      .style("opacity", .8)
      .on("mouseover", mouseOver )
      .on("mouseleave", mouseLeave )

})