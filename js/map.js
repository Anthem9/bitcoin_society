// The svg
const width = window.innerWidth,
height = window.innerHeight;
svg = d3.select("#map-svg")    
  .attr("width", innerWidth)
  .attr("height", innerHeight);


// Map and projection
const path = d3.geoPath();
const projection = d3.geoMercator()
  .scale(100)
  .center([0,20])
  .translate([width / 1.6, height / 3]);

// Data and color scale
const data = new Map();
const colorScale = d3.scaleThreshold()
  .domain([-100 ,1, 10, 100, 1000,10000, 100000])
  .range(d3.schemeBlues[7]);




const selected_year=d3.select('input[name="optionsRadiosinline"]:checked').property("value");
  console.log("d"+selected_year);

// Load external data and boot
// https://raw.githubusercontent.com/Anthem9/bitcoin_society/main/data/emissions.csv
Promise.all([
d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson"),
d3.csv("https://raw.githubusercontent.com/Anthem9/bitcoin_society/main/data/emissions.csv", function(d) {

if (selected_year==2019){data.set(d.code, +d.d2019);};
if (selected_year==2018){data.set(d.code, +d.d2018);};
if (selected_year==2017){data.set(d.code, +d.d2017);};
if (selected_year==2016){data.set(d.code, +d.d2016);};
if (selected_year==2015){data.set(d.code, +d.d2015);};
if (selected_year==2014){data.set(d.code, +d.d2014);};
})


]).then(function(loadData){
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
      .html( "Country name: "+ i.properties.name +"<br/> CO2 emission : " + i.total + " Mt"+"<br/>") 
      .style("left", (d3.pointer(d)[0] + "px"))
      .style("top", (d3.pointer(d)[1] + "px"))
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
        if (d.id=='HND'& selected_year==2019){return 'red';};
        if (d.id=='BIH'& selected_year==2018){return 'red';};
        if (d.id=='BDI'& selected_year==2017){return 'red';};
        d.total = data.get(d.id) || 0;
        return colorScale(d.total);
      })
      .style("stroke", "transparent")
      .attr("class", function(d){ return "Country" } )
      .style("opacity", .8)
      .on("mouseover", mouseOver )
      .on("mouseleave", mouseLeave )
  // drawMap(d)

})

  d3.selectAll(".radio-inline")
.on("click",function(){     
  const selected_year=d3.select('input[name="optionsRadiosinline"]:checked').property("value");
  console.log("d"+selected_year);

// Load external data and boot
// https://raw.githubusercontent.com/Anthem9/bitcoin_society/main/data/emissions.csv
Promise.all([
d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson"),
d3.csv("https://raw.githubusercontent.com/Anthem9/bitcoin_society/main/data/emissions.csv", function(d) {

if (selected_year==2019){data.set(d.code, +d.d2019);};
if (selected_year==2018){data.set(d.code, +d.d2018);};
if (selected_year==2017){data.set(d.code, +d.d2017);};
if (selected_year==2016){data.set(d.code, +d.d2016);};
if (selected_year==2015){data.set(d.code, +d.d2015);};
if (selected_year==2014){data.set(d.code, +d.d2014);};
})


]).then(function(loadData){
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
      .html( "Country name: "+ i.properties.name +"<br/> CO2 emission : " + i.total + " Mt"+"<br/>") 
      .style("left", (d3.pointer(d)[0] + "px"))
      .style("top", (d3.pointer(d)[1] + "px"))
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
        if (d.id=='HND'& selected_year==2019){return 'red';};
        if (d.id=='BIH'& selected_year==2018){return 'red';};
        if (d.id=='BDI'& selected_year==2017){return 'red';};
        d.total = data.get(d.id) || 0;
        return colorScale(d.total);
      })
      .style("stroke", "transparent")
      .attr("class", function(d){ return "Country" } )
      .style("opacity", .8)
      .on("mouseover", mouseOver )
      .on("mouseleave", mouseLeave )
  // drawMap(d)

})})