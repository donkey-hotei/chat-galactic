
const defaultParams = {
  url: 'ws://5c61f78e.ngrok.io',
  debug: true,
  shouldReconnect: true,
};

/**
 * Websocket class used as wrapper around the built-in WebSocket API.
 */
class Websocket {
  constructor(params = defaultParams) {
    this.debug = params.debug;
    this.state = {
      attempts: params.attempts || 1,
    };
    this.setupWebsocket();
    this.generateInterval = this.generateInterval.bind(this);
  }

  setupWebsocket(params = defaultParams) {
    if (!params.url) {
      this.error('Websocket URL must be present');
      return;
    }

    this.logging('Web socket connecting');

    this.ws = new WebSocket(params.url);

    this.ws.onmessage = (data) => {
      this.dispatch(data);
    };

    this.ws.onopen = () => {
      this.logging('Websocket connected.');
    };

    this.ws.onerror = () => {
      this.error('Error occured.');
    };

    this.ws.onclose = () => {
      this.logging('Websocket disconnected.');

      if (params.shouldReconnect) {
        const interval = this.generateInterval(this.state.attempts);

        this.timeoutId = setTimeout(() => {
          this.state.attempts += 1;
          this.setupWebsocket();
        }, interval);
      }
    };
  }

  dispatch(message) {
    this.logging(`Received Message: ${JSON.stringify(message)}`);
  }

  generateInterval(k) {
    return Math.min(30, 1000 * (2 ** (k - 1)));
  }

  logging(logline) {
    if (this.debug === true) {
      console.log(logline);
    }
  }

  error(logline) {
    if (this.debug === true) {
      console.error(logline);
    }
  }

  sendMessage(message) {
    this.logging(`Attempting to send message ${message}`);
    this.waitUntilSocketConnected(this.ws, () => {
      this.send({
        Event: '',
        Body: message,
      });
    });
  }

  waitUntilSocketConnected(ws, cb) {
    setTimeout(() => {
      if (ws.readyState === 1) {
        if (cb !== undefined) cb();
      } else {
        this.waitUntilSocketConnected(ws, cb);
      }
    }, 5);
  }

  send(data) {
    this.ws.send(JSON.stringify(data));
  }
}

const io = new Websocket();
export default io;
