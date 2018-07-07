import React, { Component } from 'react';
import Conversation from './components/Conversation';
import PeerList from './components/PeerList';
import InputBox from './components/InputBox';
import SendButton from './components/SendButton';
import Header from './components/Header';

class Application extends Component {
  constructor(props) {
    super(props);

    this.state = {
      conversation: [
        {
          username: 'Arthur Dent',
          content: '<p>Hello World.</p>',
        },
        {
          username: 'Stephen Hawking',
          content: '<p>Beautiful!</p>',
        },
      ],
    };
  }

  render() {
    const { conversation } = this.state;

    return (
      <div className="chat-container">
        <Header />
        <div className="view-container">
          <Conversation conversation={conversation} />
          <PeerList />
        </div>

        <form className="input-container">
          <InputBox />
          <SendButton />
        </form>
      </div>
    );
  }
}

export default Application;
