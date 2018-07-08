import React, { Component } from 'react';
import Conversation from './components/Conversation';
import PeerList from './components/PeerList';
import MessageForm from './components/MessageForm';
import Header from './components/Header';

class Application extends Component {
  constructor(props) {
    super(props);

    this.state = {
      peers: [
        {
          id: 0,
          username: 'Arthur Dent',
        },
        {
          id: 1,
          username: 'Stephen Hawking',
        },
        {
          id: 2,
          username: 'Buckaroo Banzai',
        },
      ],
      conversation: [
        {
          id: 0,
          username: 'Arthur Dent',
          content: '  Welcome to the Galaxy...',
        },
        {
          id: 1,
          username: 'Stephen Hawking',
          content: '  a^2 + b^2 == c^2 !',
        },
        {
          id: 2,
          username: 'Buckaroo Banzai',
          content: '  Have you guys seen my overthrustor anywhere?',
        },
      ],
    };
  }

  render() {
    const { peers, conversation } = this.state;

    return (
      <div className="chat-container">
        <Header />
        <div className="view-container">
          <Conversation conversation={conversation} />
          <PeerList peers={peers} />
        </div>

        <MessageForm />
      </div>
    );
  }
}

export default Application;
