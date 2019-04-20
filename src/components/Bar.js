import React, { Component } from 'react';
import '../App.css';
import * as d3 from 'd3';

class Bar extends Component {

	
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

	var x = d3.scaleBand().rangeRound([0, width]).domain(data.map(function(d) { return d.date; })).paddingInner(0.05);

	var y = d3.scaleLinear().range([height, 0]).domain([0, d3.max(data, function(d) { return d.value; })]);

	var xAxis = d3.axisBottom(x)
	    .tickFormat(d3.timeFormat("%Y-%m"));

	var yAxis = d3.axisLeft(y)
	    .ticks(10);

	var svg = d3.select("#bar_chart").append("svg")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
	  .append("g")
	    .attr("transform", 
	          "translate(" + margin.left + "," + margin.top + ")");

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", "-.55em")
      .attr("transform", "rotate(-90)" );

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Value ($)");

  svg.selectAll("bar")
      .data(data)
      .enter()
      .append("rect")
      .style("fill", "steelblue")
      .attr("x", function(d) { return x(d.date); })
      .attr("width", x.bandwidth())
      .attr("y", function(d) { return y(d.value); })
      .attr("height", function(d) { return height - y(d.value); });

	}

	componentDidMount(){
		this.drawChart();
	}

	componentWillReceiveProps(nextProps) {
		this.drawChart(nextProps.data);
	}
  render() {
    return (
        <div id="bar_chart"></div>
    );
  }
}

export default Bar;
