import React, { Component } from 'react';
import './App.css';

import Dropdown from './components/Dropdown'
import Graph from './components/Graph'
import Date from './components/Date'

class App extends Component {

  constructor(props){
    super(props)
    this.state = {
      type : 'shaded',
      from : '1999-08-14',
      to : '2019-08-13',
      list : [ { name : 'T10Y2Y: plot line area chart (shaded line chart)', type: 'shaded'}, { name : 'GDPCA: plot bar chart for the last 20 years', type:'bar'}, { name : 'DGS10 minus T10YIE: plot line chart', type:'line' }]
    }
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange(event){
    var type = event.target.value;
    this.setState({
      type: type
    });
  }

  updateInputDate(key,evt){
    var value = evt.target.value;
    var obj = {};
    obj[key] = value ;
    debugger;
    this.setState((state) => obj);
  }

  render() {
    return (
      <div className="App">
        <Dropdown list={this.state.list} onChange={this.handleChange}/>
        <Date onChange={this.updateInputDate.bind(this)} from={this.state.from} to={this.state.to}/>
        <Graph type={this.state.type} from={this.state.from} to={this.state.to}/>
      </div>
    );
  }
}

export default App;
