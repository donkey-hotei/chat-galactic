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
          id: 0,
          username: 'Arthur Dent',
          content: '  Hello World.',
        },
        {
          id: 1,
          username: 'Stephen Hawking',
          content: '  Beautiful!',
        },
        {
          id: 2,
          username: 'Buckaroo Banzai',
          content: '  What the fuck?',
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

        <form className="input-container" onSubmit={() => 'test'}>
          <InputBox />
          <SendButton />
        </form>
      </div>
    );
  }
}

export default Application;
