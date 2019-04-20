import React, { Component } from 'react';
import '../App.css';
import * as d3 from 'd3';

class Line extends Component {

	drawChart(data){
		// set the dimensions and margins of the graph
		var that = this;
		if(!this.props.data.length && !data){
			return;
		}
		var data = this.props.data.length ? this.props.data : data;
		var filtered = [];
		
		data[0].observations.filter(function(obsA){
			return data[1].observations
				.some(function(obsB){
					if(obsA.date === obsB.date){
						filtered.push({
							date : d3.timeParse("%Y-%m-%d")(obsA.date),
							value : !isNaN(obsA.value) ? +(obsA.value - obsB.value).toFixed(2) : 0
						})
						return true;
					}
					return false;
				})
		});
		
		data = filtered;

		var margin = {top: 10, right: 30, bottom: 50, left: 50},
		    width = 800 - margin.left - margin.right,
		    height = 400 - margin.top - margin.bottom;
		
		// append the svg object to the body of the page
		var svg = d3.select("#line_chart")
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
	      .domain([0, d3.max(data, function(d) { return +d.value; })])
	      .range([ height, 0 ]);
	    svg.append("g")
	      .call(d3.axisLeft(yScale));

	    var line = d3.line()
		   .x(function(d) { return xScale(d.date)})
		   .y(function(d) { return yScale(d.value)})

		svg.append("path")
			.datum(data)
			.attr("fill", "none")
			.attr("stroke", "steelblue")
			.attr("stroke-linejoin", "round")
			.attr("stroke-linecap", "round")
			.attr("stroke-width", 1.5)
			.attr("d", line);

	}
	
	componentWillUnmount(){
		d3.select("svg").remove();
	}

	componentDidMount(){
		this.drawChart();
	}

	componentWillReceiveProps(nextProps) {
		d3.select("svg").remove();
		this.drawChart(nextProps.data);
	}

	render() {
		return <div id="line_chart"></div>
	}
}

export default Line;