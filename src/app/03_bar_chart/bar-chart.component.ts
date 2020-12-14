import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import * as d3 from "d3";

@Component({
    selector: 'app-bar-chart',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './bar-chart.component.html',
    styleUrls: ['./bar-chart.component.css']
})
export class BarChartComponent implements OnInit {

    title = 'Arc Diagram';

    constructor() {}

    ngOnInit() {

        var margin = { top: 20, right: 50, bottom: 80, left: 30}, 
                       width = 500 - margin.left - margin.right,  
                       height = 400 - margin.top - margin.bottom;
            
        // append the svg object to the body of the page
        var svg = d3.select("#my_dataviz")
            .append("svg").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom)
            .append("g") .attr("transform", "translate(" + margin.left + "," + margin.top + ")");         

            var data = { "nodes": [
                {
                  "id": 1,
                  "name": "Naruto-ujamaki"
                },
                {
                  "id": 2,
                  "name": "saske-uchiha"
                },
                {
                  "id": 3,
                  "name": "sakura-albenia"
                },
                {
                  "id": 4,
                  "name": "lili-brok-lee"
                },
                {
                  "id": 5,
                  "name": "yellow-flash"
                },
                {
                  "id": 6,
                  "name": "kakashi-of-leave"
                },
                {
                  "id": 7,
                  "name": "madara-uchiha"
                },
                {
                  "id": 8,
                  "name": "minta-silver-flash"
                },
                {
                  "id": 9,
                  "name": "danzo-the-evil"
                },
                {
                  "id": 10,
                  "name": "Jasmiine"
                }
              ],
              "links": [
            
                {
                  "source": 1,
                  "target": 2
                },
                {
                  "source": 1,
                  "target": 5
                },
                {
                  "source": 1,
                  "target": 6
                },
            
                {
                  "source": 2,
                  "target": 3
                },
                        {
                  "source": 2,
                  "target": 7
                }
                ,
            
                {
                  "source": 3,
                  "target": 4
                },
                 {
                  "source": 8,
                  "target": 3
                }
                ,
                {
                  "source": 4,
                  "target": 5
                }
                ,
            
                {
                  "source": 4,
                  "target": 9
                }
              ]
            };

            // Read dummy data
          //  d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/data_network.json", function( data) {
            
                // List of node names
                var allNodes = data.nodes.map(function(d){ return d.name })
            
                // A linear scale to position the nodes on the X axis
                var x = d3.scalePoint().range([0, width]).domain(allNodes)
            
                // Add the circle for the nodes
                var nodes = svg.selectAll("mynodes")
                                  .data(data.nodes).enter()
                                  .append("circle")
                                    .attr("cx", function(d){ return(x(d.name))})
                                    .attr("cy", height-30).attr("r", 8)
                                    .style("fill", "#69b3a2")
            
                // And give them a label
                var labels = svg.selectAll("mylabels").data(data.nodes).enter().append("text")
                                  .attr("x", 0)
                                  .attr("y", 0)
                                  .text(function(d){ return(d.name)} )
                                  .style("text-anchor", "start")
                                  .attr("transform", function(d){ return( "translate(" + (x(d.name)) + "," + (height-10) + ")rotate(60)")})
                               // .style("font-size", 16)
            
                // Add links between nodes. Here is the tricky part.
                // In my input data, links are provided between nodes -id-, NOT between node names.
                // So I have to do a link between this id and the name
                var idToNode = {};
                data.nodes.forEach(function (n) { idToNode[n.id] = n; });
                // Cool, now if I do idToNode["2"].name I've got the name of the node with id 2
            
                // Add the links
                var links = svg.selectAll('mylinks').data(data.links).enter().append('path')
                .attr('d', function (d) {
                    const start = x(idToNode[d.source].name)    // X position of start node on the X axis
                    const end = x(idToNode[d.target].name)      // X position of end node
                    return ['M', start, height-30,    // the arc starts at the coordinate x=start, y=height-30 (where the starting node is)
                    'A',                            // This means we're gonna build an elliptical arc
                    (start - end)/2, ',',    // Next 2 lines are the coordinates of the inflexion point. Height of this point is proportional with start - end distance
                    (start - end)/2, 0, 0, ',',
                    start < end ? 1 : 0, end, ',', height-30] // We always want the arc on top. So if end is before start, putting 0 here turn the arc upside down.
                    .join(' ');
                }).style("fill", "none").attr("stroke", "black")
            
                // Add the highlighting functionality
                nodes.on('mouseover', function (d) { // Highlight the nodes: every node is green except of him
                    nodes.style('fill', "#B8B8B8")
                    d3.select(this).style('fill', 'firebrick')
                    // Highlight the connections
                    links              
                          .style('stroke', function (arcd) { 
                              return  arcd.source === d.id  ? 'firebrick' : 'none';})
                          .style('stroke-width', function (arcd) {
                              return arcd.source === d.id ? 4 : 1;})      
                          .attr("stroke-dasharray", function(arcd) {
                                return  arcd.source === d.id  ? this.getTotalLength() : 0;})
                          .attr("stroke-dashoffset", function(arcd) 
                                { return  arcd.source === d.id  ? this.getTotalLength() : 0;})
                          // reveal the arcs   
                          .transition()
                          .duration(1000)
                          .attr("stroke-dashoffset", 0)
                    })

                    .on('mouseout', function (d) {
                    nodes.style('fill', "#69b3a2")
                    links
                        .style('stroke', 'black')
                        .style('stroke-width', '1')
                    })


                    labels.on('mouseover', function (d) { // Highlight the nodes: every node is green except of him
                      nodes.style('fill', "#B8B8B8")
                      d3.select(this).style('fill', 'firebrick')

                      
                      // Highlight the connections
                      links              
                            .style('stroke', function (arcd) { 
                                return  arcd.source === d.id  ? 'firebrick' : 'none';})
                            .style('stroke-width', function (arcd) {
                                return arcd.source === d.id ? 4 : 1;})      
                            .attr("stroke-dasharray", function(arcd) {
                                  return  arcd.source === d.id  ? this.getTotalLength() : 0;})
                            .attr("stroke-dashoffset", function(arcd) 
                                  { return  arcd.source === d.id  ? this.getTotalLength() : 0;})
                            // reveal the arcs   
                            .transition()
                            .duration(1000)
                            .attr("stroke-dashoffset", 0)
                      })
  
                      .on('mouseout', function (d) {
                            labels.style('fill', "#69b3a2")
                            links.style('stroke', 'black').style('stroke-width', '1')
                      })
            //})
            
            
            // text hover nodes
            svg
                .append("text")
                .attr("text-anchor", "middle")
                .style("fill", "#B8B8B8")
                .style("font-size", "17px")
                .attr("x", 150)
                .attr("y", 10)
                .html("Hover over nodes to view the dependency relation")

          
    }

    
}



// async function drawArc() {

//   const data = await d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/data_network.json") 
  

//  const dimensions = ({  
//   height:300,
//   width:900,  
//   margin: {
//       top: 5,
//       right: 30,
//       bottom: 30,
//       left: 10,
//     } 
// })

  
// const svg = d3.select("#chart")
//     .append("svg")
//       .attr("width", dimensions.width + dimensions.margin.left)
//       .attr("height", dimensions.height);

// const allNodes = data.nodes.map(function(d){return d.name})


// const x = d3.scalePoint()
//     .range([10, 850])
//     .domain(allNodes)  
  

  
// svg.selectAll("mylabels")
//     .data(data.nodes)
//     .enter()
//     .append("text")
//       .attr("x", function(d){ return(x(d.name))})
//       .attr("y", dimensions.height-5)
//       .text(function(d){ return(d.name)})
//       .style("text-anchor", "middle")  
  
  
// const idToNode = {};
//   data.nodes.forEach(function (n) {
//     idToNode[n.id] = n;
//   });  
  
// let start
// let end
  
// svg.selectAll('mylinks')
//     .data(data.links)
//     .enter()
//     .append('path')
//     .attr('d', function (d) {
//       start = x(idToNode[d.source].name)    
//       end = x(idToNode[d.target].name)     
//       return ['M', start, dimensions.height-30,
//       'A',
//       (start - end)/2, ',',
//       (start - end)/2, 0, 0, ',',
//       start < end ? 1 : 0, end, ',', dimensions.height-30]
//       .join(' ');
//       })
//     .style("fill", "none")
//     .attr("stroke", "black")  
  
//   svg.selectAll("mynodes")
//     .data(data.nodes)
//     .enter()
//     .append("circle")
//       .attr("cx", function(d){ return(x(d.name))})
//       .attr("cy", dimensions.height-30)
//       .attr("r", 8)
//       .style("fill", "#69b3a2")
  
// } 
