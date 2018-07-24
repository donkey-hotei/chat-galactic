import React, { Component } from 'react';
import Conversation from './components/Conversation';
import PeerList from './components/PeerList';
import MessageForm from './components/MessageForm';
import Header from './components/Header';

export default class Application extends Component {
  constructor(props) {
    super(props);

    this.state = {
      peers: [],
      conversation: [],
    };

    this.updateConversation = this.updateConversation.bind(this);
  }

  componentDidMount() {
    const websocket = new WebSocket('ws://localhost:3001/ws');

    websocket.onmessage = (message) => {
      const { conversation } = this.state;
      try {
        conversation.push(JSON.parse(message.data));
        this.setState({ conversation });
      } catch (error) {
        console.error('Failed to parse message.');
      }
    };

    this.setState({ websocket });
  }

  updateConversation(message) {
    const { websocket } = this.state;
    if (message.content === '') return;
    try {
      websocket.send(JSON.stringify(message));
    } catch (error) {
      console.error('Failed to send message.');
    }
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

        <MessageForm parentCallback={this.updateConversation} />
      </div>
    );
  }
}
