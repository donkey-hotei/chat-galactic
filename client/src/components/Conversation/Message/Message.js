import React from 'react';
import PropTypes from 'prop-types';
import './Message.css';

const Message = ({ message }) => (
  <div className="message">
    <strong>
      {message.username}
    </strong>
    :
    {message.content}
  </div>
);

Message.propTypes = {
  message: PropTypes.objectOf(PropTypes.string).isRequired,
};

export default Message;
