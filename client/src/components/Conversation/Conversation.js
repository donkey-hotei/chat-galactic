import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Message from './Message';
import './Conversation.css';

class Conversation extends Component {
  render() {
    const { conversation } = this.props;

    return (
      <div className="conversation">
        {
          conversation.map(convo => <Message message={convo.content} />)
        }
      </div>
    );
  }
}

Conversation.propTypes = {
  conversation: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default Conversation;
