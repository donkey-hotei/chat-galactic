import React, { Component } from 'react';
import FontAwesome from 'react-fontawesome';

class ChatButton extends Component {
    render() {
        return (
            <div className='button'>
                <FontAwesome name="rocket" />
            </div>
        );
    }
}

export default ChatButton;
