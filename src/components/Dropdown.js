import React, { Component } from 'react';
import '../App.css';

class DropDown extends Component {
  componentDidMount() {
    //document.querySelector('#select-g select:first-child').focus();
  }
  render() {
    return (
      <div id="select-g">
        <select onChange={this.props.onChange}>
          {
            this.props.list.map((item, index) => (
              <option key={index} value={item.type}>{item.name}</option>
            ))
          }
        </select>
      </div>
    );
  }
}

export default DropDown;
