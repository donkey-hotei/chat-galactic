import React from 'react';
import PropTypes from 'prop-types';
import { v4 } from 'uuid';
import Message from './Message';
import './Conversation.css';

const Conversation = ({ conversation }) => (
  <div className="conversation">
    {conversation.map(message => (
      <Message
        key={v4()}
        uuid={message.uuid}
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
