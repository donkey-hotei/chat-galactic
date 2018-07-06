import React, { Component } from 'react';
import io from '../../lib/websocket';

import './InputBox.css';

class InputBox extends Component {
  handleEnter(target) {
    const { userInput } = this.props;

    if (target.charCode === 13) io.sendMessage(this.props.userInput);
  }

  render() {
    return (
      <input
        type="text"
        className="inputbox"
        onKeyPress={this.handleEnter.bind(this)}
        onChange={this.props.onChange}
      />
    );
  }
}

export default InputBox;
