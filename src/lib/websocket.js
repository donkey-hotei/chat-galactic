class Websocket {
    constructor(params=defaultParams) {
        this.debug = params.debug;
        this.state = {
            attempts: params.attempts || 1
        }
        this.setupWebsocket();
    }

    setupWebsocket(params=defaultParams) {
        this.logging("Connecting websocket.");
        this.ws = new WebSocket(params.url);
        this.ws.onmessage = (data) => {
            this.dispatch(data);
        };
        this.ws.onopen = () => {
            this.logging("Websocket connected.");
        };
        this.ws.onerror = () => {
            this.logging("Error occured.");
        };
        this.ws.onclose = () => {
            this.logging('Websocket disconnected.');
            if (params.shouldReconnect) {
                let time = this.generateInterval(this.state.attempts)
                this.timeoutId = setTimeout(() => {
                    this.state.attempts++;
                    this.ws = new WebSocket(params.url);
                    this.setupWebsocket();
                }, time);
            }
        }
    }

    dispatch() { }

    generateInterval(k) {
        return Math.min(30, (Math.pow(2, k) - 1)) * 1000;
    }

    logging(logline) {
        if (this.debug === true)
            console.log(logline);
    }

    send(data) {
        this.logging("Sending data.");
        this.ws.send(JSON.stringify(data));
    }
}

const defaultParams = {
    url: "ws://d79fd9ff.ngrok.io",
    debug: true,
    shouldReconnect: true
}
const io = new Websocket();
export default io;
