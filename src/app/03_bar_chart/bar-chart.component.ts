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

      var colors = d3.scaleOrdinal(d3.schemeCategory10);

      var svg = d3.select("svg"),
          width = +svg.attr("width"),
          height = +svg.attr("height"),
          node,
          link;
  
      svg.append('defs').append('marker')
          // .attrs({'id':'arrowhead',
          //     'viewBox':'-0 -5 10 10',
          //     'refX':13,
          //     'refY':0,
          //     'orient':'auto',
          //     'markerWidth':13,
          //     'markerHeight':13,
          //     'xoverflow':'visible'})
          .append('svg:path')
          .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
          .attr('fill', '#999')
          .style('stroke','none');
  
      var simulation = d3.forceSimulation()
          .force("link", d3.forceLink().id(function (d) {return d.id;}).distance(100).strength(1))
          .force("charge", d3.forceManyBody())
          .force("center", d3.forceCenter(width / 2, height / 2));
  

        let graph = {
          "nodes": [
            {
              "name": "Peter",
              "label": "Person",
              "id": 1
            },
            {
              "name": "Michael",
              "label": "Person",
              "id": 2
            },
            {
              "name": "Neo4j",
              "label": "Database",
              "id": 3
            },
            {
              "name": "Graph Database",
              "label": "Database",
              "id": 4
            }
          ],
          "links": [
            {
              "source": 1,
              "target": 2,
              "type": "KNOWS",
              "since": 2010
            },
            {
              "source": 1,
              "target": 3,
              "type": "FOUNDED"
            },
            {
              "source": 2,
              "target": 3,
              "type": "WORKS_ON"
            },
            {
              "source": 3,
              "target": 4,
              "type": "IS_A"
            }
          ]
        }

          let links = graph.links;
          let nodes = graph.nodes;

          link = svg.selectAll(".link")
          .data(links)
          .enter()
          .append("line")
          .attr("class", "link")
          .attr('marker-end','url(#arrowhead)')

          link.append("title")
          .text(function (d) {return d.type;});

          const edgepaths = svg.selectAll(".edgepath")
            .data(links)
            .enter()
            .append('path')
            // .attrs({
            //     'class': 'edgepath',
            //     'fill-opacity': 0,
            //     'stroke-opacity': 0,
            //     'id': function (d, i) {return 'edgepath' + i}
            // })
            .style("pointer-events", "none");

            const edgelabels = svg.selectAll(".edgelabel")
            .data(links)
            .enter()
            .append('text')
            .style("pointer-events", "none")
            // .attrs({
            //     'class': 'edgelabel',
            //     'id': function (d, i) {return 'edgelabel' + i},
            //     'font-size': 10,
            //     'fill': '#aaa'
            // });

            edgelabels.append('textPath')
            .attr('xlink:href', function (d, i) {return '#edgepath' + i})
            .style("text-anchor", "middle")
            .style("pointer-events", "none")
            .attr("startOffset", "50%")
            .text(function (d) {return d.type});

            node = svg.selectAll(".node")
            .data(nodes)
            .enter()
            .append("g")
            .attr("class", "node")
            .call(d3.drag()
                    .on("start", dragstarted)
                    .on("drag", dragged)
                    //.on("end", dragended)
            );

            node.append("circle")
            .attr("r", 5)
            .style("fill", function (d, i) {return colors(i);})

        node.append("title")
            .text(function (d) {return d.id;});

        node.append("text")
            .attr("dy", -3)
            .text(function (d) {return d.name+":"+d.label;});

        simulation
            .nodes(nodes)
            .on("tick", ticked);

        simulation.force("link")
            .links(links);

            function ticked() {
              link
                  .attr("x1", function (d) {return d.source.x;})
                  .attr("y1", function (d) {return d.source.y;})
                  .attr("x2", function (d) {return d.target.x;})
                  .attr("y2", function (d) {return d.target.y;});
      
              node
                  .attr("transform", function (d) {return "translate(" + d.x + ", " + d.y + ")";});
      
              edgepaths.attr('d', function (d) {
                  return 'M ' + d.source.x + ' ' + d.source.y + ' L ' + d.target.x + ' ' + d.target.y;
              });
      
              edgelabels.attr('transform', function (d) {
                  if (d.target.x < d.source.x) {
                      var bbox = this.getBBox();
      
                      const rx = bbox.x + bbox.width / 2;
                      const ry = bbox.y + bbox.height / 2;
                      return 'rotate(180 ' + rx + ' ' + ry + ')';
                  }
                  else {
                      return 'rotate(0)';
                  }
              });
          }
            function dragstarted(d) {
              if (!d3.event.active) simulation.alphaTarget(0.3).restart()
              d.fx = d.x;
              d.fy = d.y;
          }

          function dragged(d) {
            d.fx = d3.event.x;
            d.fy = d3.event.y;
        }


    
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
