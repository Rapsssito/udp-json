const JSONSocket = require('../src/index.js');
const dgram = require('dgram');

jest.mock('dgram');
const mockedDgram = /** @type {jest.Mocked<typeof dgram>} */ (dgram);
// Mock date
Date.now = () => 0;

const PORT = 50050;
const ADDRESS = '0.0.0.0';

/**
 * @param {any} obj
 * @param {number} size
 */
function buildBufferFromObj(obj, size) {
    const objString = JSON.stringify(obj);
    const buff = Buffer.from(objString);
    const chunks = [];
    for (let startPoint = 0; startPoint < buff.length; startPoint += size) {
        const endPoint = startPoint + size > buff.length ? buff.length : startPoint + size;
        chunks.push(buff.slice(startPoint, endPoint));
    }
    const datagramCount = chunks.length;
    const id = (Date.now() & 0xffffffff) >>> 0;
    const resultBuffers = chunks.map((ch, index) => {
        const header = Buffer.allocUnsafe(12);
        // ID
        header.writeUInt32BE(id);
        // Datagram count
        header.writeUInt32BE(datagramCount, 4);
        // Current datagram
        header.writeUInt32BE(index, 8);
        return Buffer.concat([header, ch]);
    });
    return resultBuffers;
}

test('send-default', () => {
    return new Promise((done) => {
        const mockSend = jest.fn((_msg, _port, _address, callback) => callback());
        const mockedSocket = jest.fn();
        mockedSocket.mockImplementation(() => ({ on: jest.fn(), send: mockSend }));
        mockedDgram.createSocket.mockImplementation(mockedSocket);
        const socket = mockedDgram.createSocket('udp4');
        const jsonSocket = new JSONSocket(socket);
        const sentObject = { dummy: 'Dummy' };
        jsonSocket.send(sentObject, PORT, ADDRESS, (e) => {
            expect(e).toBeFalsy();
            expect(mockSend).toHaveBeenCalledTimes(1);
            expect(mockSend).toHaveBeenCalledWith(
                buildBufferFromObj(sentObject, 1000)[0],
                PORT,
                ADDRESS,
                expect.anything()
            );
            done(null);
        });
    });
});

test('send-without-callback', () => {
    return new Promise((done) => {
        const mockSend = jest.fn((msg, port, address, callback) => {
            callback();
            expect(msg).not.toBeFalsy();
            expect(port).toBe(PORT);
            expect(address).toBe(ADDRESS);
            done(null);
        });
        const mockedSocket = jest.fn();
        mockedSocket.mockImplementation(() => ({ on: jest.fn(), send: mockSend }));
        mockedDgram.createSocket.mockImplementation(mockedSocket);
        const socket = mockedDgram.createSocket('udp4');
        const jsonSocket = new JSONSocket(socket);
        const sentObject = { dummy: 'Dummy' };
        jsonSocket.send(sentObject, PORT, ADDRESS);
    });
});

test('send-error', () => {
    return new Promise((done) => {
        const mockSend = jest.fn((_msg, _port, _address, callback) => callback(new Error('Dummy error')));
        const mockedSocket = jest.fn();
        mockedSocket.mockImplementation(() => ({ on: jest.fn(), send: mockSend }));
        mockedDgram.createSocket.mockImplementation(mockedSocket);
        const socket = mockedDgram.createSocket('udp4');
        const jsonSocket = new JSONSocket(socket);
        const sentObject = { dummy: 'Dummy' };
        jsonSocket.send(sentObject, PORT, ADDRESS, (e) => {
            expect(e).not.toBeFalsy();
            expect(mockSend).toHaveBeenCalledTimes(1);
            expect(mockSend).toHaveBeenCalledWith(
                buildBufferFromObj(sentObject, 1000)[0],
                PORT,
                ADDRESS,
                expect.anything()
            );
            done(null);
        });
    });
});

test('send-split-twice', () => {
    return new Promise((done) => {
        const mockSend = jest.fn((_msg, _port, _address, callback) => callback());
        const mockedSocket = jest.fn();
        mockedSocket.mockImplementation(() => ({ on: jest.fn(), send: mockSend }));
        mockedDgram.createSocket.mockImplementation(mockedSocket);
        const socket = mockedDgram.createSocket('udp4');
        const jsonSocket = new JSONSocket(socket, { maxPayload: 12 });
        const sentObject = { dummy: 'Dummy' };
        jsonSocket.send(sentObject, PORT, ADDRESS, (e) => {
            expect(e).toBeFalsy();
            expect(mockSend).toHaveBeenCalledTimes(2);
            done(null);
        });
    });
});

test('message-default', () => {
    return new Promise((done) => {
        /** @type {any} */
        let mockCallback;
        const mockedSocket = jest.fn();
        mockedSocket.mockImplementation(() => ({
            on: (/** @type {string} */ _evt, /** @type {(arg0: Buffer, arg1: any) => void}*/ callback) => {
                mockCallback = callback;
            },
        }));
        mockedDgram.createSocket.mockImplementation(mockedSocket);
        const socket = mockedDgram.createSocket('udp4');
        const jsonSocket = new JSONSocket(socket);
        const messageErrorListener = jest.fn();
        jsonSocket.on('message-error', messageErrorListener);
        jsonSocket.on('message-complete', (msg, rinfo) => {
            expect(rinfo).toEqual(rinfoTest);
            expect(msg).toEqual(testJSON);
            expect(messageErrorListener).not.toHaveBeenCalled();
            done(null);
        });
        const rinfoTest = { address: '127.0.0.1', port: 5666 };
        const testJSON = { dummy: 'Dummy' };
        const messageTest = buildBufferFromObj(testJSON, 1000)[0];
        mockCallback(messageTest, rinfoTest);
    });
});

test('message-error', () => {
    return new Promise((done) => {
        /** @type {any} */
        let mockCallback;
        const mockedSocket = jest.fn();
        mockedSocket.mockImplementation(() => ({
            on: (/** @type {string} */ _evt, /** @type {(arg0: Buffer, arg1: any) => void}*/ callback) => {
                mockCallback = callback;
            },
        }));
        mockedDgram.createSocket.mockImplementation(mockedSocket);
        const socket = mockedDgram.createSocket('udp4');
        const jsonSocket = new JSONSocket(socket);
        const messageCompleteListener = jest.fn();
        jsonSocket.on('message-complete', messageCompleteListener);
        jsonSocket.on('message-error', (e) => {
            expect(e).not.toBeFalsy();
            expect(messageCompleteListener).not.toHaveBeenCalled();
            done(null);
        });
        const rinfoTest = { address: '127.0.0.1', port: 5666 };
        const testJSON = { dummy: 'Dummy' };
        const messageTest = buildBufferFromObj(testJSON, 1000)[0];
        messageTest[messageTest.length - 1] = 0; // Modify data in transit
        mockCallback(messageTest, rinfoTest);
    });
});

test('message-split-twice', () => {
    return new Promise((done) => {
        /** @type {any} */
        let mockCallback;
        const mockedSocket = jest.fn();
        mockedSocket.mockImplementation(() => ({
            on: (/** @type {string} */ _evt, /** @type {(arg0: Buffer, arg1: any) => void}*/ callback) => {
                mockCallback = callback;
            },
        }));
        mockedDgram.createSocket.mockImplementation(mockedSocket);
        const socket = mockedDgram.createSocket('udp4');
        const jsonSocket = new JSONSocket(socket);
        const messageErrorListener = jest.fn();
        jsonSocket.on('message-error', messageErrorListener);
        jsonSocket.on('message-complete', (msg, rinfo) => {
            expect(rinfo).toEqual(rinfoTest);
            expect(msg).toEqual(testJSON);
            expect(messageErrorListener).not.toHaveBeenCalled();
            done(null);
        });
        const rinfoTest = { address: '127.0.0.1', port: 5666 };
        const testJSON = { dummy: 'Dummy' };
        const messagesTest = buildBufferFromObj(testJSON, 12);
        for (const ms of messagesTest) mockCallback(ms, rinfoTest);
    });
});

test('message-timeout', () => {
    return new Promise((done) => {
        /** @type {any} */
        let mockCallback;
        const mockedSocket = jest.fn();
        mockedSocket.mockImplementation(() => ({
            on: (/** @type {string} */ _evt, /** @type {(arg0: Buffer, arg1: any) => void}*/ callback) => {
                mockCallback = callback;
            },
        }));
        mockedDgram.createSocket.mockImplementation(mockedSocket);
        const socket = mockedDgram.createSocket('udp4');
        const jsonSocket = new JSONSocket(socket);
        const messageErrorListener = jest.fn();
        const messageCompleteListener = jest.fn();
        jsonSocket.on('message-error', messageErrorListener);
        jsonSocket.on('message-complete', messageCompleteListener);
        jsonSocket.on('message-timeout', (e) => {
            expect(e).not.toBeFalsy();
            expect(messageErrorListener).not.toHaveBeenCalled();
            expect(messageCompleteListener).not.toHaveBeenCalled();
            done(null);
        });
        const rinfoTest = { address: '127.0.0.1', port: 5666 };
        const testJSON = { dummy: 'Dummy' };
        const messagesTest = buildBufferFromObj(testJSON, 12);
        mockCallback(messagesTest[1], rinfoTest);
        jest.runOnlyPendingTimers();
    });
});
