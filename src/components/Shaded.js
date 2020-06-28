import React, { Component } from 'react';
import * as d3 from 'd3';
import '../App.css';
import { timeThursdays, schemeDark2 } from 'd3';

var margin = {top: 30, right: 30, bottom: 30, left: 30},
width = 800,
height = 400;

var t = d3.transition()
.duration(1000)
.ease(d3.easeLinear);

function drawChart(data){
	// set the dimensions and margins of the graph
	if(!data || !data.length){
		return;
	}

	data = data[0].observations;

	data = data.map(function(obj, index){
		return {
			date: d3.timeParse("%Y-%m-%d")(obj.date),
			value: obj.value === '.' ? 0 : obj.value
		}
	})
	// Add X axis
    var xScale = d3.scaleTime()
      .domain(d3.extent(data, function(d) { return d.date; }))
      .range([ margin.left, width-margin.right ]);

    // Add Y axis
    var yScale = d3.scaleLinear()
      .domain([-d3.max(data, function(d) { return +d.value; }), d3.max(data, function(d) { return +d.value; })])
	  .range([ height-margin.bottom, margin.top ]);


	var area = d3.area()
	.x(function(d) { return xScale(d.date) })
	.y0(yScale(0))
	.y1(function(d) { return yScale(+d.value) });

	return {
		path: {
			d: area(data)
		},
		xScale,
		yScale
	}
}
class Shaded extends Component {


	state = {
		path: {
			d: ''
		}
	}

	yAxis = d3.axisLeft();
	xAxis = d3.axisBottom();

	componentDidMount() {
		console.log('component did mount');
	}
	static getDerivedStateFromProps(nextProps, prevState){
		const {data} = nextProps;
		if(!data.length) return {};
		const {path, xScale, yScale} = drawChart(data);
		return {path, xScale, yScale, data:data[0].observations};
	}

	componentDidUpdate(prevProps, prevState, snapshot){
		if(!this.state.xScale || !this.state.path.d) return;
		if(!this.props.data.length) return;
		// if(prevProps.data.length) return;
		this.xAxis.scale(this.state.xScale);
		d3.select(this.refs.xAxis).call(this.xAxis);
		this.yAxis.scale(this.state.yScale);
		d3.select(this.refs.yAxis).call(this.yAxis);
		var path = d3.select(this.refs.path)
		.selectAll('path')
		.data(this.state.data);
		console.log(path);
		path.exit()
		.transition(t)
		.attr('d', this.state.path.d)
		.remove();

		var enter = path.enter().append('path');

		path = enter.merge(path)
			.transition(t)
			.attr('d', this.state.path.d);

	}


	render() {
		return (
			<svg width={width} height={height}>
				<g ref='path'>
					<path fill={'#cce5ef'} stroke={'#69b3a2'} strokeWidth={'1.5'}></path>
				</g>
				<g ref="xAxis" transform={`translate(0,${((height)/2)})`}></g>
				<g ref="yAxis" transform={`translate(${margin.left},0)`}></g>
			</svg>
		)
	}
}

export default Shaded;