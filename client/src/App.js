import React, { Component } from 'react';
import Conversation from './components/Conversation';
import PeerList from './components/PeerList';
import MessageForm from './components/MessageForm';
import Header from './components/Header';

const SIGNALING_SERVER = `ws://${window.location.hostname}:3001/ws`;

export default class Application extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uuid: '',
      peers: [],
      conversation: [],
      onMessageCallbacks: {
        register: (data) => {
          const { uuid, name } = data;
          this.setState({ uuid, name });
        },
        unregister: (data) => {
          const { conversation } = this.state;
          this.setState({
            conversation: conversation.concat({
              name: data.name,
              message: ' has disconnected.',
            }),
          });
        },
        offer: (data) => {
          console.log(data);
        },
        answer: (data) => {
          console.log(data);
        },
        peers: (data) => {
          const { peers } = data;
          this.setState({ peers });
        },
        message: (data) => {
          const { conversation } = this.state;
          this.setState({
            conversation: conversation.concat(data),
          });
        },
      },
    };
    this.updateConversation = this.updateConversation.bind(this);
  }

  componentDidMount() {
    const { onMessageCallbacks } = this.state;
    const websocket = new WebSocket(SIGNALING_SERVER);
    websocket.onmessage = (e) => {
      try {
        const { uuid } = this.state;
        const data = JSON.parse(e.data);
        if (data.uuid === uuid) return;
        if (onMessageCallbacks[data.type]) {
          onMessageCallbacks[data.type](data);
        }
      } catch (err) {
        console.error(err);
      }
    };
    websocket.push = websocket.send;
    websocket.send = (_data) => {
      const { uuid, name } = this.state;
      const data = _data;
      data.uuid = uuid;
      data.name = name;
      data.type = 'message';
      websocket.push(JSON.stringify(data));
    };
    this.setState({ websocket });
  }

  updateConversation(data) {
    const { websocket, conversation } = this.state;
    if (data.message === '') return;
    try {
      this.setState({
        conversation: conversation.concat(data),
      });
      websocket.send(data);
    } catch (err) {
      console.error(err);
    }
  }

  render() {
    const {
      uuid,
      peers,
      conversation,
    } = this.state;

    return (
      <div className="chat-container">
        <Header />
        <div className="view-container">
          <Conversation conversation={conversation} />
          <PeerList peers={peers} />
        </div>
        <MessageForm
          uuid={uuid}
          updateConversation={this.updateConversation}
        />
      </div>
    );
  }
}
