import React, { Component } from 'react';
import io from '../../lib/websocket';

import './SendButton.css';

class SendButton extends Component {
  sendMessage() {
    io.sendMessage(this.props.userInput);
  }

  render() {
    return (
      <button
        type="submit"
        onClick={this.sendMessage.bind(this)}
      >
                Send
      </button>
    );
  }
}

export default SendButton;
