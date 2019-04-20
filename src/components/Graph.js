import React, { Component } from 'react';
import Shaded from './Shaded';
import Bar from './Bar';
import Line from './Line';
import { getObservationsBySeriesId } from '../services/dataService';
import config from '../config/config';

class Graph extends Component {

  constructor(props){
    super(props);
    this.state = {
      data : []
    };
  }

  clearData() {
    this.setState({data : []});
  }

  getSeriesId(type){
    return config['SERIES_ID'][type]
  }

  fetchContentByType(type){
    var ids = this.getSeriesId(type).split('-'),
        that = this;
    
    ids = ids.map((id) => {
      return getObservationsBySeriesId(id)
    });
    return ids.reduce((promiseChain, currentTask) => {
      return promiseChain.then(chainResults =>
          currentTask.then(currentResult =>
              [ ...chainResults, currentResult ]
          )
      );
    }, Promise.resolve([])).then(arrayOfResults => {
        that.setState((state) => {
          state.data = state.data.concat(arrayOfResults);
          return state;
        });
    });
  }

  
  componentDidMount() {
    this.fetchContentByType(this.props.type);
  }
  
  componentWillReceiveProps(nextProps) {
    this.clearData();
    this.fetchContentByType(nextProps.type);
  }

  renderComponent(){
    switch(this.props.type){
      case 'shaded': 
        return <Shaded data={this.state.data} />;
      case 'bar': 
        return <Bar data={this.state.data} />; 
      case 'line': 
        return <Line data={this.state.data} />

      default:
        return 'No component to render';
    }
  }

  render() {
    return (
      this.renderComponent()
    );
  }
}

export default Graph;
