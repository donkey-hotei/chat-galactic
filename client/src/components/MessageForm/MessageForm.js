import React, { Component } from 'react';
import './MessageForm.css';

class MessageForm extends Component {
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

    console.log(value);

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

export default MessageForm;
