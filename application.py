
"""
A simple signaling server for setting up initial peer connections.
"""
import json
import random
import logging
from flask import Flask, request, session, render_template, make_response
from flask_socketio import SocketIO, send, emit


#logging.basicConfig(filename='signaling.log',level=logging.DEBUG)
#logger = logging.getLogger('signaling')

app = Flask(__name__)
socketio = SocketIO(app)

connected_peers = {}

class PeerConnection:
    def __init__(self, sid=None, name=None):
        self.sid = sid
        self.name = name
        self.connected = True

    def emit(self, event, data):
        emit(event, data, room=self.sid)


def find_peer(sid):
    """Find peer by session id."""
    for name, peer in connected_peers.items():
        if peer.sid == sid:
            return peer


@app.route('/')
def index():
    return render_template('index.html')


@socketio.on('connect')
def connect_handler():
    name = 'planet_%d' % random.randint(0, 42)
    emit('session', {'token': name})


@socketio.on('disconnect')
def disconnect_handler():
    peer = find_peer(request.sid)
    if peer is None:
        print("peer with sid %s, does not exist" % request.sid)
    else:
        del connected_peers[peer.name]
        print('%s is disconnecting' % peer.name)
        print('%d peers connected' % len(connected_peers.keys()))
        print(connected_peers)


@socketio.on('session')
def session_handler(message):
    name = message['token']
    if name not in connected_peers.keys():
        print('%s has connected' % name)
        peer = PeerConnection(sid=request.sid, name=name)
        connected_peers[peer.name] = peer
        peer.emit('greeting', 'Welcome to the Galaxy %s.' % peer.name)
    else:
        print('%s has connected')
        peer = connected_peers[name]
        peer.sid = request.sid
        peer.emit('greeting', 'Welcome to the Galaxy %s.' % peer.name)

    print(connected_peers)


if __name__ == '__main__':
    socketio.run(app)

