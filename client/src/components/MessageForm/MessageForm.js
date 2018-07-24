import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './MessageForm.css';

export default class MessageForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: '',
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({
      value: event.target.value,
    });
  }

  handleSubmit(event) {
    const { value } = this.state;
    const { parentCallback } = this.props;

    this.setState({ value: '' });
    parentCallback({
      id: 4,
      username: 'Arthur Dent',
      content: value,
    });

    event.preventDefault();
  }

  render() {
    const { value } = this.state;

    return (
      <form className="input-container" onSubmit={this.handleSubmit}>
        <input
          type="text"
          className="inputbox"
          value={value}
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
  parentCallback: PropTypes.func.isRequired,
};
