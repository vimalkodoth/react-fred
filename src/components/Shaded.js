import React, { Component } from 'react';
import * as d3 from 'd3';
import '../App.css';

class Shaded extends Component {

	drawChart(data){
	// set the dimensions and margins of the graph
	if(!this.props.data.length && !data){
		return;
	}

	var data = this.props.data.length ? this.props.data[0].observations: data[0].observations;

	data = data.map(function(obj, index){
		return {
			date: d3.timeParse("%Y-%m-%d")(obj.date),
			value: obj.value === '.' ? 0 : obj.value
		}
	})
	var margin = {top: 10, right: 30, bottom: 50, left: 50},
	    width = 800 - margin.left - margin.right,
	    height = 400 - margin.top - margin.bottom;

	// append the svg object to the body of the page
	var svg = d3.select("#shaded_chart")
	  .append("svg")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
	    .append("g")
	    .attr("transform",
	          "translate(" + margin.left + "," + margin.top + ")");
	
	// Add X axis
    var xScale = d3.scaleTime()
      .domain(d3.extent(data, function(d) { return d.date; }))
      .range([ 0, width ]);
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(xScale).tickFormat(d3.timeFormat("%Y-%m")))
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", "-.55em")
      .attr("transform", "rotate(-90)" );


    // Add Y axis
    var yScale = d3.scaleLinear()
      .domain([-d3.max(data, function(d) { return +d.value; }), d3.max(data, function(d) { return +d.value; })])
      .range([ height, 0 ]);
    svg.append("g")
      .call(d3.axisLeft(yScale));

    // Add the area
    svg.append("path")
      .datum(data)
      .attr("fill", "#cce5df")
      .attr("stroke", "#69b3a2")
      .attr("stroke-width", 1.5)
      .attr("d", d3.area()
        .x(function(d) { return xScale(d.date) })
        .y0(yScale(0))
        .y1(function(d) { return yScale(+d.value) })
      );
	}
	
	componentDidMount(){
		this.drawChart();
	}

	componentWillUnmount(){
		d3.select("svg").remove();
	}
	componentWillReceiveProps(nextProps) {
		if(!nextProps.data.length) return;
		d3.select("svg").remove();
		this.drawChart(nextProps.data);
	}

	render() {
		console.log('whats happening ???');
		return (
			<div id="shaded_chart"></div>
		)
	}


}

export default Shaded;