// @ts-nocheck
import JSONSocket from './Socket.js';
import dgram from 'dgram';

const socket = dgram.createSocket('udp4');
socket.bind(56554, '127.0.0.1');
const jsonSocket = new JSONSocket(socket);

jsonSocket.on('message-complete', (msg, rinfo) => {
    console.log(rinfo, msg);
});

const socket2 = dgram.createSocket('udp4');
const jsonSocket2 = new JSONSocket(socket2);
jsonSocket2.send({ 1: '2345' }, 56554, '127.0.0.1', (e) => {
    if (e) {
        console.log('error', e);
        return;
    }
    console.log('sent');
});
