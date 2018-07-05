import React, { Component } from 'react';
import io from '../../lib/websocket.js';

import './InputBox.css';

class InputBox extends Component {

    handleEnter(target) {
        if (target.charCode === 13)
            io.sendMessage(this.props.userInput);
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
