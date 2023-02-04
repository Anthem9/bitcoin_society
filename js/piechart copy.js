Promise.all([
  d3.csv("data/EnergyConsumptionBySource.csv"),
  d3.csv("data/AnnualizedGreenhouseGasEmissions.csv")
]).then(function(files) {
  d3.select("#go-button").on('click', function() {
    d3.select("#inner_piechart").remove();
    var lowbound = d3.select('#msg_lowbound').property('value');
    var upbound = d3.select('#msg_upbound').property('value');
    createPieChart(files[0],files[1],lowbound,upbound);
  });
  createPieChart(files[0],files[1]);
})



//create the pie chart
const createPieChart = (dataElec,dataCO2,lowbound,upbound) => {

      
  //initialization
  const windowWidth = window.innerWidth/1.1, windowHeight = window.innerHeight/1.2;
  const Energy_Source_list = ["nuclear", "fossil_fuels", "renewable"];
  const color_list = ["rgba(233,233,12,0.6)","rgba(33,23,122,0.3)","rgba(175,238,238,0.6)"] //175,238,238  33,23,122
  const value_range=15;
  const outRadius_Bitcoin_Elec=10*Math.log(dataElec.filter(d => d.Year == "2019" & d.Country == "Bitcoin" & d.Energy_Source=='total').map(d => d.Consumption_TWh/1.5)[0]);
  const outRadius_Bitcoin_CO2=7*Math.log(dataCO2.filter(d => d.Country == "Bitcoin" ).map(d => d.Year2019)[0]);

  var svg_legends=d3.select("#piechart")
    .append("svg")
    .attr("id","inner_piechart")
    .attr("width", windowWidth)
    .attr("height", windowHeight);

  //read the dataElec
  const dataElec2019 = dataElec.filter(d => d.Year == "2019" & d.Energy_Source!='total');
  const dataElec2019_bitcoin=dataElec.filter(d => d.Year == "2019" & d.Energy_Source!='total' & d.Country=="Bitcoin");
  const dataElec2019_bitcoinConsumption=dataElec.filter(d => d.Year == "2019" & d.Energy_Source=='total' & d.Country=="Bitcoin").map(d=>d.Consumption_TWh);
  if(upbound>lowbound){
  dataElec2019_nearBitcoin=
  dataElec.filter(d => d.Year == "2019" & d.Country!="Bitcoin" & d.Energy_Source=='total' 
  & (
  (d.Consumption_TWh<(dataElec2019_bitcoinConsumption[0]*parseFloat(upbound))) &
  (d.Consumption_TWh>(dataElec2019_bitcoinConsumption[0]*parseFloat(lowbound)))
  ))}
  else{
    dataElec2019_nearBitcoin=
  dataElec.filter(d => d.Year == "2019" & d.Country!="Bitcoin" & d.Energy_Source=='total' 
  & (
  (d.Consumption_TWh<(dataElec2019_bitcoinConsumption[0]*parseFloat(upbound))) ||
  (d.Consumption_TWh>(dataElec2019_bitcoinConsumption[0]*parseFloat(lowbound)))
  ))}
  ;

  const country_list=  Array.from(d3.group(dataElec2019_nearBitcoin, d => d.Country).keys());



  //call functions
  drawLegend();drawBitcoinPie();drawCountryPie();floating();
  
  function drawLegend(){

      //add the legend
      for (let i = 0; i < Energy_Source_list.length; i++) {
        svg_legends.append('rect')
        .attr('x', width/20)
        .attr('y', 30+i*20)
        .attr('width', 30)
        .attr('height', 10)
        .attr('fill', color_list[i]);

        svg_legends.append("text")
        .text(Energy_Source_list[i])
        .attr("x", width/9)             
        .attr("y", 37+i*20)
        .attr('text-anchor', 'start')
        .style("font-size","12px");
      };
}

function drawBitcoinPie(){
  //create bitcoin pie chart
  var  g_bitcoin=svg_legends.append("g")
  .attr("transform",  "translate("+Math.round(windowWidth/2)+","+Math.round(windowHeight/2)+")")
  .attr("id","bitcoinPie")
  .call(
    d3.drag()
  .on("start", dragstarted)
  .on("drag", dragged)
  .on("end", dragended)
  )
  .selectAll().data(d3.pie()
  .value((d) => d.Consumption_TWh)
  .sort((a, b) => a.Energy_Source - b.Energy_Source)(dataElec2019_bitcoin)).enter();

//gradient settings
  var lg = g_bitcoin.append("defs").append("radialGradient")
  .attr("id", "mygrad_Elec")//id of the gradient
  .attr("cx", "50%")
  .attr("cy", "50%")
  .attr("r", "50%")
  .attr("fx", "50%")
  .attr("fy", "50%")//since its a vertical linear gradient ;
  lg.append("stop")
  .attr("offset", "0%")
  .style("stop-color", "transparent")//end in red
  .style("stop-opacity", 0.1);
  lg.append("stop")
  .attr("offset", "66%")
  .style("stop-color", "white")//end in red
  .style("stop-opacity", 0.1);
  lg.append("stop")
  .attr("offset", "80%")
  .style("stop-color", "blue")//start in blue
  .style("stop-opacity", 0.05);
  lg.append("stop")
  .attr("offset", "100%")
  .style("stop-color", "white")//start in blue
  .style("stop-opacity", 0.1);

  //gradient settings
  var lg1 = g_bitcoin.append("defs").append("radialGradient")
  .attr("id", "mygrad_Elec1")//id of the gradient
  .attr("cx", "50%")
  .attr("cy", "50%")
  .attr("r", "50%")
  .attr("fx", "50%")
  .attr("fy", "50%")//since its a vertical linear gradient ;
  lg1.append("stop")
  .attr("offset", "0%")
  .style("stop-color", "transparent")//end in red
  .style("stop-opacity", 0.1);
  lg1.append("stop")
  .attr("offset", "90%")
  .style("stop-color", "white")//end in red
  .style("stop-opacity", 0.1);
  lg1.append("stop")
  .attr("offset", "100%")
  .style("stop-color", "yellow")//start in blue
  .style("stop-opacity", 1);

//green gass circles with shades
var shades_radius_Elec=outRadius_Bitcoin_CO2*2.5;
  g_bitcoin.append('circle')
  .attr('cx', 0)
  .attr('cy', 0)
  .attr('r', shades_radius_Elec)
  .attr("fill", "url(#mygrad_Elec)");
  g_bitcoin.append('circle')
  .attr('cx', 0)
  .attr('cy', 0)
  .attr('r', shades_radius_Elec*0.75)
  .attr("fill", "url(#mygrad_Elec1)")
  .attr('fill-opacity', 0.1);
  // g_bitcoin.append('circle')
  // .attr('cx', 0)
  // .attr('cy', 0)
  // .attr('r', outRadius_Bitcoin_Elec+1)
  // .attr("fill", 'white');




  //energy sources
  g_bitcoin.append("path")
  .attr("d",d3.arc().innerRadius(0).outerRadius(outRadius_Bitcoin_Elec))
  .attr("fill", function(d, i) {
  return color_list[i%3] // here it is picking up colors in sequence
  });
  g_bitcoin.append("text")
  .text("Bitcoin")
  .attr("x", 0)             
  .attr("y", -outRadius_Bitcoin_Elec-25)
  .attr('text-anchor', 'middle')
  .style("font-size","25px");

  
  //add line segments for electricity
  var svg1 = d3.select('#bitcoinPie').append('svg').attr('x',-outRadius_Bitcoin_Elec).attr('y',-outRadius_Bitcoin_Elec);
      svg1.attr('width', outRadius_Bitcoin_Elec*2);
      svg1.attr('height', outRadius_Bitcoin_Elec*2);
      svg1.append('line')
      .attr("x1",0)
      .attr("y1", outRadius_Bitcoin_Elec)
      .attr('x2', outRadius_Bitcoin_Elec*2)
      .attr("y2", outRadius_Bitcoin_Elec)
      .attr("stroke-width", 1)
      .attr("stroke", "black")
      .style("stroke-dasharray","5,5");
      svg1.append('line')
      .attr("x1",0)
      .attr("y1", outRadius_Bitcoin_Elec-10)
      .attr('x2', 0)
      .attr("y2", outRadius_Bitcoin_Elec+10)
      .attr("stroke-width", 2)
      .attr("stroke", "black")
      .style("stroke-dasharray","5,5");
      svg1.append('line')
      .attr("x1",outRadius_Bitcoin_Elec*2)
      .attr("y1", outRadius_Bitcoin_Elec-10)
      .attr('x2',outRadius_Bitcoin_Elec*2)
      .attr("y2", outRadius_Bitcoin_Elec+10)
      .attr("stroke-width", 2)
      .attr("stroke", "black")
      .style("stroke-dasharray","5,5");
      g_bitcoin.append("text")
        .text("ELEC. 68.23TWh")
        .attr("x", outRadius_Bitcoin_Elec+60)             
        .attr("y", 0)
        .attr('text-anchor', 'middle')
        .style("font-size","14px")
        ;
  //add line segments for greenhouse gas
  var svg2 = d3.select('#bitcoinPie').append('svg').attr('x',-shades_radius_Elec).attr('y',-shades_radius_Elec);
      svg2.attr('width', shades_radius_Elec*2);
      svg2.attr('height', shades_radius_Elec*2);
      svg2.append('line')
      .attr("x1",shades_radius_Elec*0.6*0.45+5)
      .attr("y1", shades_radius_Elec*0.8*0.45-5)
      .attr('x2', shades_radius_Elec*0.6*0.45-5)
      .attr("y2", shades_radius_Elec*0.8*0.45+5)
      .attr("stroke-width", 1)
      .attr("stroke", "black")
      .style("stroke-dasharray","5,5");

      svg2.append('line')
      .attr("x1",shades_radius_Elec*0.6*0.5)
      .attr("y1", shades_radius_Elec*0.8*0.5)
      .attr('x2', shades_radius_Elec*0.6*0.5+10)
      .attr("y2", shades_radius_Elec*0.6*0.5+15)
      .attr("stroke-width", 1)
      .attr("stroke", "black")
      .style("stroke-dasharray","5,5");
     
      svg2.append('line')
      .attr("x1",shades_radius_Elec*1.7+5)
      .attr("y1", shades_radius_Elec*1.7-5)
      .attr('x2', shades_radius_Elec*1.7-5)
      .attr("y2", shades_radius_Elec*1.7+5)
      .attr("stroke-width", 1)
      .attr("stroke", "black")
      .style("stroke-dasharray","5,5");
 
      svg2.append('line')
      .attr("x1",shades_radius_Elec*1.7)
      .attr("y1", shades_radius_Elec*1.7)
      .attr('x2', shades_radius_Elec*1.5)
      .attr("y2", shades_radius_Elec*1.5)
      .attr("stroke-width", 1)
      .attr("stroke", "black")
      .style("stroke-dasharray","5,5");

      g_bitcoin.append("text")
        .text("CO2 102.25tons")
        .attr("x", shades_radius_Elec*0.8)             
        .attr("y", shades_radius_Elec*0.6+13)
        .attr('text-anchor', 'left')
        .style("font-size","14px")
}

function drawCountryPie(){
    // countries that are near bitcoin
    for (let j = 0; j < country_list.length; j++) {
     
    const xPosition=(Math.random()* (0.7 - 0.1) + 0)*windowWidth;
    const yPosition=(Math.random()* (0.8 - 0.2) + 0.2)*windowHeight;
      
    if (country_list[j]!="bitcoin"){
      var g_country= svg_legends.append("g")
      .attr("transform","translate("+xPosition+","+yPosition+")")
      .attr("id",country_list[j])
      .attr("class","countries")
      .call(
        d3.drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended)
      )
      .selectAll().data(d3.pie()
      .value((d) => d.Consumption_TWh)
      .sort((a, b) => a.Energy_Source - b.Energy_Source)(dataElec.filter(d => d.Year == "2019" & d.Energy_Source!='total' & d.Country == country_list[j]))).enter()
      ;}
      
    const outRadius_Country_Elec=10*Math.log(dataElec.filter(d => d.Year == "2019" & d.Country == country_list[j] & d.Energy_Source=='total').map(d => d.Consumption_TWh/1.5));
    outRadius_country_CO2=7*Math.log(dataCO2.filter(d => d.Country == country_list[j]).map(d => d.Year2019));
      //gradient settings
    var lg = g_country.append("defs").append("radialGradient")
    .attr("id", "mygrad_co2")//id of the gradient
    .attr("cx", "50%")
    .attr("cy", "50%")
    .attr("r", "50%")
    .attr("fx", "50%")
    .attr("fy", "50%")//since its a vertical linear gradient ;
    lg.append("stop")
    .attr("offset", "66%")
    .style("stop-color", "white")//end in red
    .style("stop-opacity", 0.1);
    lg.append("stop")
    .attr("offset", "80%")
    .style("stop-color", "blue")//start in blue
    .style("stop-opacity", 0.05);
    lg.append("stop")
    .attr("offset", "100%")
    .style("stop-color", "white")//start in blue
    .style("stop-opacity", 0.1);

    //green gass circles with shades

    var shades_radius_Elec=outRadius_country_CO2*2.5;

      g_country.append('circle')
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', shades_radius_Elec)
      .attr("fill", "url(#mygrad_co2)");

      // g_country.append('circle')
      // .attr('cx', 0)
      // .attr('cy', 0)
      // .attr('r', outRadius_Country_Elec+1)
      // .attr("fill", 'transparent');


    g_country.append("path")
    .attr("d",d3.arc().innerRadius(0).outerRadius(outRadius_Country_Elec))
    .attr("fill", function(d, j) {
      return color_list[j%3] // here it is picking up colors in sequence
    });
    g_country.append("text")
    .text(country_list[j])
    .attr("x", 0)             
    .attr("y", outRadius_Country_Elec + 20)
    .attr('text-anchor', 'middle')
    .style("font-size","16px");

    };


}


function floating() {

     
    width_box=windowWidth/(country_list.length+3);
    const ideal_position_list = [];
    for (let m = 0; m < country_list.length; m++) {
      if (m<country_list.length/2){
        ideal_position_list[m]=width_box*(m+1)+width_box*Math.random()/2;}
      else {
        ideal_position_list[m]=width_box*(m+2)+width_box*Math.random()/2;
      };
      y1=parseInt(d3.select("#"+country_list[m]).attr('transform').match(/(?<=\,).*(?=\))/));
      
      d3.select("#"+country_list[m]).transition().duration(5000)
          .attr("transform", "translate("+ideal_position_list[m]+","+(y1)+")");
    }
        }
      

function Eucliendistance(x1,y1,x2,y2){
  var a=x1-x2;
  var b=y1-y2;
  var distance=Math.sqrt( a*a + b*b );
  return distance;
}


  //function of dragging
  function dragstarted(_event) {
    d3.select(this).raise().classed("active", true);
    }

  function dragged(event) {
      d3.select(this).attr("transform", "translate("+event.x+","+event.y+")");
      }
  
  function dragended(event) {
      const bitcoin_x= parseInt( d3.select("#bitcoinPie").attr("transform").match(/(?<=\().*(?=\,)/));
      const bitcoin_y= parseInt( d3.select("#bitcoinPie").attr("transform").match(/(?<=\,).*(?=\))/));
      // var distance=Eucliendistance(event.x,event.y,bitcoin_x,bitcoin_y);

      const Countries_selected_x = [];
      const Countries_selected_y = [];
      Countries_selected_x[0]=bitcoin_x;
      Countries_selected_y[0]=bitcoin_y;

      d3.selectAll(".countries").each(function(d,i) {
        Countries_selected_x[i+1] = parseInt(d3.select(this).attr("transform").match(/(?<=\().*(?=\,)/));
        Countries_selected_y[i+1] = parseInt(d3.select(this).attr("transform").match(/(?<=\,).*(?=\))/));
      })

      
      for (let j = 0; j < Countries_selected_x.length; j++) {
        distance=Eucliendistance(event.x,event.y,Countries_selected_x[j],Countries_selected_y[j]);
        if (distance>1 & distance<60){
      d3.select(this).attr("transform", "translate("+Countries_selected_x[j]+","+Countries_selected_y[j]+")");
      }}
      d3.select(this).classed("active", false);
  }}