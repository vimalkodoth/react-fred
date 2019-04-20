import React, { Component } from 'react';
import '../App.css';

class DropDown extends Component {

  render() {
    return (
        <div>
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
