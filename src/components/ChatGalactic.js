import React, { Component } from 'react';
import MessageList from './MessageList';
import PeerList from './PeerList';
import InputBox from './InputBox';
import ChatButton from './ChatButton';

class ChatGalactic extends Component {
    render() {
        return (
            <div>
                <MessageList />
                <PeerList />
                <div>
                    <ChatButton />
                    <InputBox />
                </div>
            </div>
        );
    }
}

export default ChatGalactic;
