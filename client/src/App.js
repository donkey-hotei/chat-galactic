import React, { Component } from 'react';
import MessageList from './components/MessageList';
import PeerList from './components/PeerList';
import InputBox from './components/InputBox';
import SendButton from './components/SendButton';

class Application extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userInput: '',
    };
  }

  updateShared(event) {
    this.setState({ userInput: event.target.value });
  }

  render() {
    const { userInput } = this.props;

    return (
      <div className="chat-container">
        <div className="view-container">
          <MessageList />
          <PeerList />
        </div>

        <div className="input-container">
          <InputBox
            userInput={userInput}
            onChange={this.updateShared.bind(this)}
          />
          <SendButton
            userInput={userInput}
          />
        </div>
      </div>
    );
  }
}

export default Application;
