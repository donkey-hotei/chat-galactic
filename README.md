## chat-galactic: an experimental P2P chatroom application using WebRTC


#### Installation

To yank dependencies for the python signaling server, use pip:
```bash
pip install flask flask_socketio eventlet
```

For the client-side socket.io library, clone the project into `static` directory like so:
```bash
git clone https://github.com/socketio/socket.io-client static/js/socket.io
```
#### Running the Signaling Server

Simply run `python application.py` and visit localhost at port 5000.



