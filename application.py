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
        broadcast('peer disconnected', {'peer': peer.name})


@socketio.on('session')
def session_handler(message):
    peer = None
    name = message['token']
    print('%s has connected' % name)

    if name not in connected_peers.keys():
        peer = PeerConnection(sid=request.sid, name=name)
        connected_peers[peer.name] = peer

        peer.emit('greeting', 'Welcome to the Galaxy %s.' % peer.name)
        peer.emit('request offer', {
            'available_peers': connected_peers.keys()
        })

        print('%s peers connected' % len(connected_peers.keys()))
        print(connected_peers)

    else:
        peer = connected_peers[name]
        peer.sid = request.sid

        peer.emit('greeting', 'Welcome to the galaxy, %s' % peer.name)
        peer.emit('request_offer', {
            'available_peers': connected_peers.keys()
        })

        print('%s peers connected' % len(connected_peers.keys()))
        print(connected_peers)

    broadcast('peer connected', {'peer': peer.name})
    # end


@socketio.on('offer')
def handle_offer(offer):
    """ Recieves offer from caller.
    """
    print("Received offer: %s" % offer)
    src = offer['source']
    dst = offer['destination']
    if dst not in connected_peers.keys():
        # emit back to the source that this peer does not actually exist
        pass
    else:
        peer = connected_peers[dst]
        peer.emit('offer', offer)

if __name__ == '__main__':
    socketio.run(app)

