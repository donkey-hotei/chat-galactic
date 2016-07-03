import random
import logging
from flask import Flask, render_template
from flask_socketio import SocketIO, send, emit

logging.basicConfig(filename='signaling.log',level=logging.DEBUG)
logger = logging.getLogger('signaling')

app = Flask(__name__)
socketio = SocketIO(app)


@app.route('/')
def index():
    return render_template('index.html')


@socketio.on('init')
def signaling(message):
    send("Hello, Welcome to the Galaxy.")


if __name__ == '__main__':
    socketio.run(app)
