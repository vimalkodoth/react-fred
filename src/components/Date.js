import React, { Component } from 'react';

class Date extends Component {

  constructor(props){
    super(props);
  }

  render() {
    return (
      <div id="select-g-date">
        <input type="date" id="dateFrom" value={this.props.from} onChange={(evt) => this.props.onChange('from', evt)}/>
        <input type="date" id="dateTo" value={this.props.to} onChange={(evt) => this.props.onChange('to', evt)} />
      </div>
    );
  }
}

export default Date;
