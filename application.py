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

# { peer_name: PeerConnection }
connected_peers = {}

class PeerConnection:
    def __init__(self, sid=None, name=None):
        self.sid = sid
        self.name = name
        self.connected = True

    def emit(self, event, data):
        emit(event, data, room=self.sid)


def find_peer(sid):
    """Find peer by session id (a str)."""
    for name, peer in connected_peers.items():
        if peer.sid == sid:
            return peer


def broadcast(event, data):
    """Broadcast message event with data to each connected peer."""
    for peer in connected_peers.values():
        peer.emit(event, data)
    return


@app.route('/')
def index():
    return render_template('index.html')


@socketio.on('connect')
def connect_handler():
    name = 'planet_%d' % random.randint(0, 42)
    emit('session', {'token': name})
    return


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
        broadcast('peer disconnected', {'peer': peer.name})
    return


@socketio.on('session')
def session_handler(message):
    peer = None
    name = message['token']
    print('%s has connected' % name)

    if name not in connected_peers.keys():
        peer = PeerConnection(sid=request.sid, name=name)
        connected_peers[peer.name] = peer

        peer.emit('greeting', 'Welcome to the Galaxy %s.' % peer.name)
        peer.emit('available peers', {
            'available_peers': connected_peers.keys()
        })

        print('%s peers connected' % len(connected_peers.keys()))
        print(connected_peers)

    else:
        peer = connected_peers[name]
        peer.sid = request.sid

        peer.emit('greeting', 'Welcome to the galaxy, %s' % peer.name)
        peer.emit('available peers', {
            'available_peers': connected_peers.keys()
        })

        print('%s peers connected' % len(connected_peers.keys()))
        print(connected_peers)

    broadcast('peer connected', {'peer': peer.name})
    return


@socketio.on('jsep')
def handle_jsep(jsep):
    """ Route offers/answers from caller peer to callee peer and vice versa
    """
    jsep_type = jsep['jsep']['type']
    src = jsep['source']
    dst = jsep['destination']
    print("Received an %s from %s to %s." % (jsep_type, src, dst))
    if dst not in connected_peers.keys():
        peer.emit('error', {'message': 'Peer does not exist.'})
    else:
        peer = connected_peers[dst]
        if jsep_type == 'offer':
            print("Routing offer to %s." % dst)
            peer.emit('offer', jsep)
        elif jsep_type == 'answer':
            print("Routing answer to %s." % dst)
            peer.emit('answer', jsep)
    return


if __name__ == '__main__':
    socketio.run(app)

