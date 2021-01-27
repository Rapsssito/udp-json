const JSONSocket = require('../src/index');
const dgram = require('dgram');

// Listener socket
const socket = dgram.createSocket('udp4');
socket.bind(56554, '127.0.0.1');
const jsonSocket = new JSONSocket(socket);
jsonSocket.on('message-complete', (msg, rinfo) => {
    console.log('Message received', rinfo, msg);
});
jsonSocket.on('message-error', (e) => {
    console.log('Error', e);
});
jsonSocket.on('message-timeout', (e) => {
    console.log('Error', e);
});

// Sender socket
const socket2 = dgram.createSocket('udp4');
const jsonSocket2 = new JSONSocket(socket2, { maxPayload: 496, timeout: 1000 });
jsonSocket2.send({ dummy: 'Dummy Text' }, 56554, '127.0.0.1', (e) => {
    if (e) {
        console.log('error', e);
        return;
    }
    console.log('Message sent');
});
