import React, { Component } from 'react';
import './Message.css';

class Message extends Component {
  render() {
    const { user } = this.props;
    return (
      <div className="message">
        <strong>
          {user}
          :
        </strong>
      </div>
    );
  }
}

export default Message;
