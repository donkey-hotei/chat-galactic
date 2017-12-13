import io from 'socket.io-client';

const socket = io.connect('http://3a4f433b.ngrok.io');

function subscribeToTimer(cb) {
    socket.on('timer', timestamp => cb(null, timestamp));
    socket.emit('on subscribe', 1000);
}

export { subscribeToTimer };