import React, { Component } from 'react';
import MessageList from './MessageList';
import PeerList from './PeerList';
import InputBox from './InputBox';
import SendButton from './SendButton';

class Application extends Component {

    constructor(props) {
        super(props);
        this.state = {
            userInput: ""
        }
    }

    updateShared(event) {
        this.setState({userInput: event.target.value});
    }

    render() {
        return (
            <div>
                <div className="view-container">
                    <MessageList />
                    <PeerList />
                </div>

                <div className="input-container">
                    <InputBox
                      userInput={this.state.userInput}
                      onChange={this.updateShared.bind(this)}
                    />
                    <SendButton
                      userInput={this.state.userInput}
                    />
                </div>
            </div>
        );
    }
}

export default Application;
