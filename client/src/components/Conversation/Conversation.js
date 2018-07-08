import React from 'react';
import PropTypes from 'prop-types';
import Message from './Message';
import './Conversation.css';

const Conversation = ({ conversation }) => (
  <div className="conversation">
    {conversation.map(message => (
      <Message
        key={message.id}
        message={message}
      />
    ))
    }
  </div>
);


Conversation.propTypes = {
  conversation: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default Conversation;
