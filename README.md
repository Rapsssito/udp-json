# udp-json <!-- omit in toc -->
<p align="center">
  <img src="https://github.com/Rapsssito/udp-json/workflows/tests/badge.svg" />
  <img src="https://img.shields.io/npm/dw/udp-json" />
  <img src="https://img.shields.io/npm/v/udp-json?color=gr&label=npm%20version" />
<p/>

Lightweight JSON UDP socket API written in JavaScript for NodeJS. It provides a simple protocol on top of UDP to send/receive JSON objects. **It does not handle UDP unreliability**.

## Table of Contents <!-- omit in toc -->

- [Getting started](#getting-started)
- [Usage](#usage)
- [API](#api)
  - [JSONSocket](#jsonsocket)
    - [`JSONSocket()`](#jsonsocket-1)
    - [`send()`](#send)
    - [`'message-complete'`](#message-complete)
    - [`'message-error'`](#message-error)
- [Maintainers](#maintainers)
- [License](#license)

## Getting started
Install the library using either Yarn:

```
yarn add udp-json
```

or npm:

```
npm install --save udp-json
```

## Usage
```javascript
const JSONSocket = require('udp-json');

// Listener socket
const socket = dgram.createSocket('udp4');
socket.bind(56554, '127.0.0.1');
const jsonSocket = new JSONSocket(socket)
jsonSocket.on('message-complete', (msg, rinfo) => {
    console.log('Message received', rinfo, msg);
})

// Sender socket
const socket2 = dgram.createSocket('udp4');
const jsonSocket2 = new JSONSocket(socket2, {maxPayload: 496, timeout: 1000});
jsonSocket2.send({ dummy: 'Dummy Text' }, 56554, '127.0.0.1', (e) => {
    if (e) {
        console.log('error', e);
        return;
    }
    console.log('Message sent');
});
```

## API
Here are listed all methods implemented in `udp-json`.

### JSONSocket
* **Methods:**
  * [`JSONSocket(Socket[, options])`](#jsonsocket)
  * [`send(obj, port[, address][, callback])`](#send)
* **Events:**
  * [`'message-complete'`](#message-complete)
  * [`'message-error'`](#message-error)

#### `JSONSocket()`
`JSONSocket(Socket[, options])`. Creates a JSON socket using the given [`options`](#jsonsocket-options).
##### `JSONSocket: options` <!-- omit in toc -->
Available options for creating a socket. It must be an `object` with the following properties:

| Property     | Type       | Description                                                                                    |
| ------------ | ---------- | ---------------------------------------------------------------------------------------------- |
| `maxPayload` | `<number>` | Max payload size. **Default**: `496`.                                                          |
| `timeout`    | `<number>` | Max time between receiving a new datagram and the last datagram received. **Default**: `1000`. |

#### `send()`
`send(obj, port[, address][, callback])`. Broadcasts an object on the socket. The destination `port` must be specified. An optional `callback` function may be specified to as a way of reporting errors or for determining when all datagrams have been sent.

#### `'message-complete'`
The `'message-complete'` event is emitted when a new object is available on a socket. The event handler function is passed two arguments: `obj` and `rinfo`.

#### `'message-error'`
The `'message-error'` event is emitted whenever any error occurs, including a timeout between datagrams. The event handler function is passed a single `Error` object.

## Maintainers

* [Rapsssito](https://github.com/rapsssito) [[Support me :heart:](https://github.com/sponsors/Rapsssito)]

## License

The library is released under the MIT license. For more information see [`LICENSE`](/LICENSE).
