import React from 'react';
import PropTypes from 'prop-types';
import './Message.css';

const Message = ({ message }) => (
  <div className="message">
    <strong>
      {message.name}
    </strong>
    :
    {message.message}
  </div>
);

Message.propTypes = {
  message: PropTypes.shape({
    id: PropTypes.number,
    username: PropTypes.string,
    content: PropTypes.string,
  }).isRequired,
};

export default Message;
