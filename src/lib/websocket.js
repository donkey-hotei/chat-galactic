class Websocket {
    constructor(params=defaultParams) {
        this.debug = params.debug;
        this.state = {
            attempts: params.attempts || 1
        }
        this.setupWebsocket();
    }

    setupWebsocket(params=defaultParams) {
        if (!params.url) {
            this.error("Invalid URL for websocket.");
            return;
        }

        this.logging("Connecting websocket...");

        this.ws = new WebSocket(params.url);

        this.ws.onmessage = (data) => {
            this.dispatch(data);
        };

        this.ws.onopen = () => {
            this.logging("Websocket connected.");
        };

        this.ws.onerror = () => {
            this.error("Error occured.");
        };

        this.ws.onclose = () => {
            this.logging('Websocket disconnected.');

            if (params.shouldReconnect) {
                let interval = this.generateInterval(this.state.attempts)
                this.timeoutId = setTimeout(() => {
                    this.state.attempts++;
                    this.setupWebsocket();
                }, interval);
            }
        }
    }

    dispatch(message) {
        this.logging("Received Message: " + JSON.stringify(message));
    }

    generateInterval(k) {
        return Math.min(30, (Math.pow(2, k) - 1)) * 1000;
    }

    logging(logline) {
        if (this.debug === true)
            console.log(logline);
    }

    error(logline) {
        if (this.debug === true)
            console.error(logline);
    }

    sendMessage(message) {
        this.logging("Attempting to send message " +
                     message)
        this.waitUntilSocketConnected(this.ws, () => {
            this.send({
                Event: "",
                Body:  message
            });
        });
    }

    waitUntilSocketConnected(ws, cb) {
        var self = this;
        setTimeout(() => {
            if (ws.readyState === 1) {
                if (cb !== undefined)
                    cb();
                return;
            } else
                self.waitUntilSocketConnected(ws, cb);
        }, 5);
    }

    send(data) {
        this.ws.send(JSON.stringify(data));
    }
}

const defaultParams = {
    url: "ws://5c61f78e.ngrok.io",
    debug: true,
    shouldReconnect: true
}

const io = new Websocket();
export default io;
