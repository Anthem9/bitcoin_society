d3.csv(`data/EnergyConsumptionBySource.csv`, d=>{
    return{
        'Year':d.Year,
        'Energy_Source':d.Energy_Source,
        'Consumption_TWh': parseFloat(d.Consumption_TWh),
    'Country':d.Country
    }
}).then(data => {

    createPieChart(data);

})

const createPieChart = (data) => {
  const data2020 = data.filter(d => d.Year == "2020" & d.Energy_Source!='total');
  const data2020_bitcoin=data.filter(d => d.Year == "2020" & d.Energy_Source!='total' & d.Country=="Bitcoin");

  const data2020_bitcoinConsumption=data.filter(d => d.Year == "2020" & d.Energy_Source=='total' & d.Country=="Bitcoin").map(d=>d.Consumption_TWh);
//   const data2020_nearBitcoin=data.filter(d => d.Year == "2020" & d.Energy_Source=='total' & d.Country!="Bitcoin" & d.Consumption_TWh<(data2020_bitcoinConsumption[0]*1.5) & d.Consumption_TWh>(data2020_bitcoinConsumption[0]*0.5));
const data2020_nearBitcoin=data.filter(d => d.Year == "2020" & d.Energy_Source=='total' & d.Country!="Bitcoin" & ((d.Consumption_TWh<(data2020_bitcoinConsumption[0]*1.5)& d.Consumption_TWh>(data2020_bitcoinConsumption[0]*1.3))||(d.Consumption_TWh<(data2020_bitcoinConsumption[0]*0.7)& d.Consumption_TWh>(data2020_bitcoinConsumption[0]*0.5))));
//   console.log(data2020_nearBitcoin);

  var countrylist= d3.group(data2020_nearBitcoin, d => d.Country).keys();


  var colorArray = ["rgba(233,233,12,0.6)","rgba(33,23,122,0.6)","rgba(175,238,238,0.6)"] //175,238,238  33,23,122
  
  d3.scaleSequential().domain(["nuclear", "fossil_fuels", "renewable"])
  .range(["#eeff00", "#ff0022", "#2200ff"]);
  
//   var width = window.innerWidth,
//   height = window.innerHeight;
var width = document.getElementById('piechart-box').clientWidth,
height = width * 0.75;
  const svg=d3.select("#piechart-svg")
  // .append("svg")
  // .attr("class","col")
    .attr("width", width)
    .attr("height", height);

//     svg.append("g")
//   .attr("transform", "translate(" + (width/2 - 200) + "," + 20 + ")")
//   .append("text")
//   .text("Countries whose Electricity Consumption is within the range +/- 50% of Bitcoin in 2020")
//   .attr("class", "title")

//   svg.append("g")
//   .attr("transform", "translate(" + (width/2 - 500) + "," + 40 + ")")
//   .append("text")
//   .text("The size of the pie chart reflects the total Electricity Consumption Volume. Drag Bitcoin! and drag other country onto Bitcoin!")
//   .style("font-size","16px");

  svg.append('rect')
  .attr('x', width/2 - 200)
  .attr('y', 50)
  .attr('width', 30)
  .attr('height', 10)
  .attr('fill', "rgba(233,233,12,0.6)");
  svg.append("text")
  .text("nuclear")
.attr("x", width/2 - 150)             
.attr("y", 57)
.attr('text-anchor', 'start')
.style("font-size","12px");

  svg.append('rect')
  .attr('x', width/2 - 200)
  .attr('y', 70)
  .attr('width', 30)
  .attr('height', 10)
  .attr('fill', "rgba(33,23,122,0.6)");
  svg.append("text")
  .text("fossil fuels")
.attr("x", width/2 - 150)             
.attr("y", 77)
.attr('text-anchor', 'start')
.style("font-size","12px");

  svg.append('rect')
  .attr('x', width/2 - 200)
  .attr('y', 90)
  .attr('width', 30)
  .attr('height', 10)
  .attr('fill', "rgba(175,238,238,0.6)");
  svg.append("text")
  .text("renewable")
.attr("x", width/2 - 150)             
.attr("y", 97)
.attr('text-anchor', 'start')
.style("font-size","12px");

/* countries that are near bitcoin*/
for (const country of countrylist) {
  const xPosition=(Math.random()* (0.9 - 0.2) + 0.2)*width;
  const yPosition=(Math.random()* (0.9 - 0.3) + 0.3)*height;

var  g1=svg.append("g")
.attr("transform", "translate("+xPosition+","+yPosition+")")
.attr("class","pie")
.call(
  d3.drag()
.on("start", dragstarted)
.on("drag", dragged)
.on("end", dragended)
)
.selectAll().data(d3.pie()
.value((d) => d.Consumption_TWh)
.sort((a, b) => a.Energy_Source - b.Energy_Source)(data.filter(d => d.Year == "2020" & d.Energy_Source!='total' & d.Country == country))).enter()
;

outRadius_country=data.filter(d => d.Year == "2020" & d.Country == country & d.Energy_Source=='total').map(d => d.Consumption_TWh/1.5);

g1.append("path")
.attr("d",d3.arc().innerRadius(0).outerRadius(outRadius_country))
.attr("fill", function(d, i) {
  return colorArray[i%3] // here it is picking up colors in sequence
}
)
;

g1.append("text")
.text(country)
.attr("x", 0)             
.attr("y", function(d) {return -data.filter(d => d.Year == "2020" & d.Country == country & d.Energy_Source=='total').map(d => d.Consumption_TWh/1.5)-5; })
.attr('text-anchor', 'middle')
.style("font-size","12px");

};

/* bitcoin only*/

var  g_bitcoin=svg.append("g")
.attr("transform", "translate("+width/2+","+height/2+")")
.attr("id","bitcoinPie")
.call(
  d3.drag()
.on("start", dragstarted)
.on("drag", dragged)
.on("end", dragended)
)
.selectAll().data(d3.pie()
.value((d) => d.Consumption_TWh)
.sort((a, b) => a.Energy_Source - b.Energy_Source)(data2020_bitcoin)).enter();

g_bitcoin.append("path")
.attr("d",d3.arc().innerRadius(0).outerRadius(function(d) {return data.filter(d => d.Year == "2020" & d.Country == "Bitcoin" & d.Energy_Source=='total').map(d => d.Consumption_TWh/1.5); }))
.attr("fill", function(d, i) {
return colorArray[i%3] // here it is picking up colors in sequence
}
)
;

outRadius_Bitcoin=data.filter(d => d.Year == "2020" & d.Country == "Bitcoin" & d.Energy_Source=='total').map(d => d.Consumption_TWh/1.5)[0];
g_bitcoin.append("text")
.text("Bitcoin")
.attr("x", 0)             
.attr("y", function(d) {return -data.filter(d => d.Year == "2020" & d.Country == "Bitcoin" & d.Energy_Source=='total').map(d => d.Consumption_TWh/1.5)-5; })
.attr('text-anchor', 'middle')
.style("font-size","16px");

    function dragstarted(_event) {
      d3.select(this).raise().classed("active", true);
  }
      function dragged(event) {
          d3.select(this).attr("transform", "translate("+event.x+","+event.y+")");
      }
      
      function dragended(event) {
        const bitcoin_x= d3.select("#bitcoinPie").attr("transform").match(/(?<=\()\d{1,}(?=\,)/);
        const bitcoin_y= d3.select("#bitcoinPie").attr("transform").match(/\d{1,}(?=\))/);
        const a=bitcoin_x-event.x;
        const b=bitcoin_y-event.y;
        var distance=Math.sqrt( a*a + b*b );
        outRadius_Bitcoin=data.filter(d => d.Year == "2020" & d.Country == "Bitcoin" & d.Energy_Source=='total').map(d => d.Consumption_TWh/1.5)[0];
        if (this.id!="bitcoinPie"){
        if (distance<outRadius_Bitcoin*2 ){
          d3.select(this).attr("transform", "translate("+d3.select("#bitcoinPie").attr("transform").match(/(?<=\()\d{1,}(?=\,)/)+","+d3.select("#bitcoinPie").attr("transform").match(/\d{1,}(?=\))/)+")");
        }}
        d3.select(this).classed("active", false);
      }
}