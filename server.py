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
    peer = PeerConnection(sid=request.sid, name=name)
    if len(connected_peers.keys()) != 0:
        other_peer = random.choice(connected_peers.keys())
        other_peer = connected_peers
    print('%s connected' % request.sid)
    emit('session', {'token': name})


@socketio.on('disconnect')
def disconnect_handler():
    peer = find_peer(request.sid)
    if peer is None:
        print("peer with sid %s, does not exist" % request.sid)
    else:
        del connected_peers[peer.name]
        print('%d peers connected' % len(connected_peers.keys()))
        print(connected_peers)


@socketio.on('session')
def session_handler(message):
    print('received session token %s' % message)
    name = message['token']
    if name not in connected_peers.keys():
        connected_peers[name] = PeerConnection(sid=request.sid, name=name)
    else:
        peer = connected_peers[name]
        print("changing %s's session id" % name)
        peer.sid = request.sid
        peer.emit('message', "Welcome back %s" % peer.name)
    print(connected_peers)


if __name__ == '__main__':
    socketio.run(app)

