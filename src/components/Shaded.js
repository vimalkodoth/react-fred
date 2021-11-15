import React, { Component } from 'react';
import * as d3 from 'd3';
import '../App.css';
import { timeThursdays, schemeDark2, svg } from 'd3';

var margin = { top: 30, right: 30, bottom: 30, left: 30 },
	width = 800,
	height = 400,
	bisectDate = d3.bisector(function (d) { return d.date; }).left;
var t = d3.transition()
	.duration(1000)
	.ease(d3.easeLinear);

function drawChart(data) {
	// set the dimensions and margins of the graph
	if (!data || !data.length) {
		return;
	}

	data = data[0].observations;

	data = data.map(function (obj, index) {
		return {
			date: d3.timeParse("%Y-%m-%d")(obj.date),
			value: obj.value === '.' ? 0 : obj.value
		}
	})
	// Add X axis
	var xScale = d3.scaleTime()
		.domain(d3.extent(data, function (d) { return d.date; }))
		.range([margin.left, width - margin.right]);

	// Add Y axis
	var yScale = d3.scaleLinear()
		.domain([-d3.max(data, function (d) { return +d.value; }), d3.max(data, function (d) { return +d.value; })])
		.range([height - margin.bottom, margin.top]);

	var colorExtent = d3.extent(data, d => +d.value);

	const colorScale = d3.scaleSequential().domain(colorExtent).interpolator(d3.interpolateWarm);

	var area = d3.area()
		.x(function (d) { return xScale(d.date) })
		.y0(yScale(0))
		.y1(function (d) { return yScale(+d.value) });

	return {
		path: {
			d: area(data)
		},
		xScale,
		yScale,
		colorScale,
		observations: data
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
		d3.select('.overlay').on("mousemove", this.onMouseMove.bind(this));
	}
	static getDerivedStateFromProps(nextProps, prevState) {
		const { data } = nextProps;
		if (!data.length) return {};
		const { path, xScale, yScale, colorScale, observations } = drawChart(data);
		return { path, xScale, yScale, colorScale, data: observations };
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		var that = this;
		if (!this.state.xScale || !this.state.path.d) return;
		if (!this.props.data.length) return;
		// if(prevProps.data.length) return;
		this.xAxis.scale(this.state.xScale);
		d3.select(this.refs.xAxis).call(this.xAxis);
		this.yAxis.scale(this.state.yScale);
		d3.select(this.refs.yAxis).call(this.yAxis);

		//Add a gradient
		var gradient = d3.select(this.refs.gradient);
		gradient
			.attr('x1', "0").attr('y1', "0")
			.attr('x2', "100%").attr('y2', "0")
			.selectAll('stop')
			.data(this.state.colorScale.ticks().map((t, i, n) => ({ offset: `${100 * i / n.length}%`, color: this.state.colorScale(t) })))
			.enter()
			.append('stop')
			.attr('offset', d => d.offset)
			.attr('stop-color', d => d.color);


		var path = d3.select(this.refs.path)
			.selectAll('path')
			.datum(this.state.data)

		path.exit()
			.transition(t)
			.attr('d', this.state.path.d)
			.remove();
		var enter = path.enter().append('path');

		path = enter.merge(path)
			.transition(t)
			.attr('d', this.state.path.d)

	}

	onMouseOut = (e) => {
		d3.select('.focus').style('display', 'none');
	}

	onMouseOver = (e) => {
		d3.select('.focus').style('display', null);
	}

	onMouseMove = (e) => {
		const { xScale, yScale, data } = this.state;
		if (!data) return;
		const focus = d3.select(".focus"),
			focusText = d3.select(".focusText"),
			overlay = d3.select('.overlay').node(),
			textRect = d3.select('.textRect'),
			x0 = xScale.invert(d3.mouse(overlay)[0]);
		var i = bisectDate(data, x0, 1);
		if (i <= 0 || (i >= data.length)) return;
		const d0 = data[i - 1],
			d1 = data[i],
			d = x0 - d0.date > d1.date - x0 ? d1 : d0;
		focus.attr("transform", "translate(" + xScale(d.date) + "," + yScale(+d.value) + ")");
		focus.select("text").text((d.value + ', ' + d.date.getFullYear())).style('fill', '#FFF');

		const bBox = focusText.node().getBBox();
		textRect
			.attr("width", bBox.width + 10) // 10 buffer for text padding
			.attr("height", bBox.height + 5) // 5 buffer for text padding
			.attr('rx', 10)
			.attr("fill", "rgba(0,0,0,0.45");

	}


	render() {

		var focusStyle = {
			display: 'none'
		}
		return (
			<svg ref='svg' width={width} height={height} onMouseEnter={this.onMouseOver}>
				<g ref="xAxis" transform={`translate(0,${((height) / 2)})`}></g>
				<g ref="yAxis" transform={`translate(${margin.left},0)`}></g>
				<g ref='path'>
					<linearGradient ref="gradient" id="gradient" gradientUnits="userSpaceOnUse" />
					<path strokeWidth={'1.5'} fill={'url(#gradient)'}></path>
					<g className="focus" style={focusStyle}>
						<rect className="textRect" transform={`translate(-20, 5)`}></rect>
						<g className="focusText">
							<circle r="4.5"></circle>
							<text x="-15" dy="2em"></text>
						</g>
					</g>
					<rect transform={`translate(25,25)`} className="overlay" style={{ fill: 'none', pointerEvents: 'all' }} width="760" height="350" onMouseOut={this.onMouseOut} onMouseOver={this.onMouseOver} />
				</g>
			</svg>
		)
	}
}

export default Shaded;