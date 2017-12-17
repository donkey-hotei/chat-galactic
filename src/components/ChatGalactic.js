import React, { Component } from 'react';
import Websocket from 'react-websocket';
import MessageList from './MessageList';
import PeerList from './PeerList';
import InputBox from './InputBox';
import SendButton from './SendButton';

class ChatGalactic extends Component {

    constructor(props) {
        super(props);
        this.state = {
            count: 90
        }
    }

    handleData(data) {
        let result = JSON.parse(data);
        console.log(result);
        this.setState({count: this.state.count});
    }

    render() {
        return (
            <div>
                <Websocket
                    url='ws://e0f7157e.ngrok.io'
                    onMessage={this.handleData.bind(this)}
                />

                <div className="view-container">
                    <MessageList />
                    <PeerList />
                </div>

                <div className="input-container">
                    <InputBox />
                    <SendButton />
                </div>
            </div>
        );
    }
}

export default ChatGalactic;
