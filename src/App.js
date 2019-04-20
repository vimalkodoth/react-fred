import React, { Component } from 'react';
import './App.css';

import Dropdown from './components/Dropdown'
import Graph from './components/Graph'

class App extends Component {

  constructor(props){
    super(props)
    this.state = {
      type : 'shaded',
      list : [ { name : 'T10Y2Y: plot line area chart (shaded line chart)', type: 'shaded'}, { name : 'GDPCA: plot bar chart for the last 20 years', type:'bar'}, { name : 'DGS10 minus T10YIE: plot line chart', type:'line' }]
    }
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange(event){
    this.setState({
      type: event.target.value
    });
  }

  render() {
    return (
      <div className="App">
        <Dropdown list={this.state.list} onChange={this.handleChange}/>
        <Graph type={this.state.type} />
      </div>
    );
  }
}

export default App;
