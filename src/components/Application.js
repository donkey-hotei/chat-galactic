import React, { Component } from 'react';
import MessageList from './MessageList';
import PeerList from './PeerList';
import InputBox from './InputBox';
import SendButton from './SendButton';
import Header from './Header';

class Application extends Component {
    render() {
        return (
            <div>
                <Header />

                <div className="view-container">
                    <MessageList socket={this.socket} />
                    <PeerList socket={this.socket} />
                </div>

                <div className="input-container">
                    <InputBox socket={this.socket} />
                    <SendButton socket={this.socket} />
                </div>
            </div>
        );
    }
}

export default Application;
