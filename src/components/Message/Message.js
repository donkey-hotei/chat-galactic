import React, { Component } from 'react';

import './Message.css';

class Message extends Component {
    render() {
        return (
            <div className="message">
                <strong>{this.props.user} : </strong>
            </div>
        );
    }
}

export default Message;
