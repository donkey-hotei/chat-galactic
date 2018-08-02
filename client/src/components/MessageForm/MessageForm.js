import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './MessageForm.css';

export default class MessageForm extends Component {
  constructor(props) {
    super(props);
    this.state = { message: '' };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    const { value } = e.target;
    this.setState({ message: value });
  }

  handleSubmit(e) {
    e.preventDefault();
    const { message } = this.state;
    const { updateConversation } = this.props;
    this.setState({ message: '' });
    updateConversation({ message });
  }

  render() {
    const { message } = this.state;
    return (
      <form className="input-container" onSubmit={this.handleSubmit}>
        <input
          type="text"
          className="messageform"
          value={message}
          onChange={this.handleChange}
        />
        <button type="submit">
          Send
        </button>
      </form>
    );
  }
}

MessageForm.propTypes = {
  updateConversation: PropTypes.func.isRequired,
};
