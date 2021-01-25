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
  - [Client](#client)
  - [Server](#server)
  - [SSL Client](#ssl-client)
- [API](#api)
  - [TcpSocket](#tcpsocket)
    - [`createConnection()`](#createconnection)
  - [TcpServer](#tcpserver)
    - [`listen()`](#listen)
- [Maintainers](#maintainers)
- [Acknowledgments](#acknowledgments)
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
Import the library:
```javascript
import TcpSocket from 'react-native-tcp-socket';
// const net = require('react-native-tcp-socket');
```
### Client
```javascript
// Create socket
const client = TcpSocket.createConnection(options, () => {
  // Write on the socket
  client.write('Hello server!');

  // Close socket
  client.destroy();
});

client.on('data', function(data) {
  console.log('message was received', data);
});

client.on('error', function(error) {
  console.log(error);
});

client.on('close', function(){
  console.log('Connection closed!');
});
```

### Server
```javascript
const server = TcpSocket.createServer(function(socket) {
  socket.on('data', (data) => {
    socket.write('Echo server ' + data);
  });

  socket.on('error', (error) => {
    console.log('An error ocurred with client socket ', error);
  });

  socket.on('close', (error) => {
    console.log('Closed connection with ', socket.address());
  });
}).listen({ port: 12345, host: '0.0.0.0' });

server.on('error', (error) => {
  console.log('An error ocurred with the server', error);
});

server.on('close', () => {
  console.log('Server closed connection');
});
```

### SSL Client
```javascript
const client = TcpSocket.createConnection({
    port: 8443,
    host: "example.com",
    tls: true,
    // tlsCheckValidity: false, // Disable validity checking
    // tlsCert: require('./selfmade.pem') // Self-signed certificate
});

// ...
```
_Note: In order to use self-signed certificates make sure to [update your metro.config.js configuration](#self-signed-ssl-only-available-for-react-native--060)._

## API
Here are listed all methods implemented in `react-native-tcp-socket`, their functionalities are equivalent to those provided by Node's [net](https://nodejs.org/api/net.html) (more info on [#41](https://github.com/Rapsssito/react-native-tcp-socket/issues/41)). However, the **methods whose interface differs from Node are marked in bold**.

### TcpSocket
* **Methods:**
  * **[`TcpSocket.createConnection(options[, callback])`](#createconnection)**
  * [`address()`](https://nodejs.org/api/net.html#net_socket_address)
  * [`destroy([error])`](https://nodejs.org/api/net.html#net_socket_destroy_error)
  * [`end([data][, encoding][, callback])`](https://nodejs.org/api/net.html#net_socket_end_data_encoding_callback)
  * [`setEncoding([encoding])`](https://nodejs.org/api/net.html#net_socket_setencoding_encoding)
  * [`setKeepAlive([enable][, initialDelay])`](https://nodejs.org/api/net.html#net_socket_setkeepalive_enable_initialdelay) - _`initialDelay` is ignored_
  * [`setNoDelay([noDelay])`](https://nodejs.org/api/net.html#net_socket_setnodelay_nodelay)
  * [`setTimeout(timeout[, callback])`](https://nodejs.org/api/net.html#net_socket_settimeout_timeout_callback)
  * [`write(data[, encoding][, callback])`](https://nodejs.org/api/net.html#net_socket_write_data_encoding_callback)
* **Events:**
  * [`'close'`](https://nodejs.org/api/net.html#net_event_close_1)
  * [`'connect'`](https://nodejs.org/api/net.html#net_event_connect)
  * [`'data'`](https://nodejs.org/api/net.html#net_event_data)
  * [`'error'`](https://nodejs.org/api/net.html#net_event_error_1)

#### `createConnection()`
`createConnection(options[, callback])` creates a TCP connection using the given [`options`](#createconnection-options).
##### `createConnection: options` <!-- omit in toc -->
**Required**. Available options for creating a socket. It must be an `object` with the following properties:

| Property              | Type   | iOS  | Android |Description                                                                                        |
| --------------------- | ------ | :--: | :-----: |-------------------------------------------------------------------------------------------------- |
| **`port`** | `<number>` | ✅  |   ✅   | **Required**. Port the socket should connect to. |
| `host` | `<string>` | ✅  |   ✅  | Host the socket should connect to. IP address in IPv4 format or `'localhost'`. **Default**: `'localhost'`. |
| `timeout` | `<number>` | ✅  |   ✅  | If set, will be used to call [`setTimeout(timeout)`](https://nodejs.org/api/net.html#net_socket_settimeout_timeout_callback) after the socket is created, but before it starts the connection. |
| `localAddress` | `<string>` | ✅  |   ✅  | Local address the socket should connect from. If not specified, the OS will decide. It is **highly recommended** to specify a `localAddress` to prevent overload errors and improve performance. |
| `localPort` | `<number>` | ✅  |   ✅  | Local port the socket should connect from. If not specified, the OS will decide. |
| `interface`| `<string>` | ❌  |   ✅  | Interface the socket should connect from. If not specified, it will use the current active connection. The options are: `'wifi', 'ethernet', 'cellular'`. |
| `reuseAddress`| `<boolean>` | ❌  |   ✅  | Enable/disable the reuseAddress socket option. **Default**: `true`. |
| `tls`| `<boolean>` | ✅  |   ✅  | Enable/disable SSL/TLS socket creation. **Default**: `false`. |
| `tlsCheckValidity`| `<boolean>` | ✅  |   ✅  | Enable/disable SSL/TLS certificate validity check. **Default**: `true`. |
| `tlsCert`| `<any>` | ✅  |   ✅  | CA file (.pem format) to trust. If `null`, it will use the device's default SSL trusted list. Useful for self-signed certificates. _See [example](#ssl-client) for more info_. **Default**: `null`. |

**Note**: The platforms marked as ❌ use the default value.

### TcpServer
* **Methods:**
  * [`TcpSocket.createServer(connectionListener)`](https://nodejs.org/api/net.html#net_net_createserver_options_connectionlistener)
  * **[`listen(options[, callback])`](#listen)**
  * [`close([callback])`](https://nodejs.org/api/net.html#net_server_close_callback)
* **Events:**
  * [`'close'`](https://nodejs.org/api/net.html#net_event_close)
  * [`'connection'`](https://nodejs.org/api/net.html#net_event_connection)
  * [`'error'`](https://nodejs.org/api/net.html#net_event_error)
  * [`'listening'`](https://nodejs.org/api/net.html#net_event_listening)

#### `listen()`
`listen(options[, callback])` creates a TCP server socket using the given [`options`](#listen-options).

##### `listen: options` <!-- omit in toc -->
**Required**. Available options for creating a server socket. It must be an `object` with the following properties:

| Property              | Type   | iOS  | Android |Description                                                                                        |
| --------------------- | ------ | :--: | :-----: |-------------------------------------------------------------------------------------------------- |
| **`port`** | `<number>`  | ✅  |   ✅    | **Required**. Port the socket should listen to. |
| `host` | `<string>` | ✅  |   ✅    | Host the socket should listen to. IP address in IPv4 format or `'localhost'`. **Default**: `'0.0.0.0'`. |
| `reuseAddress`| `<boolean>` | ❌  |   ✅    | Enable/disable the reuseAddress socket option. **Default**: `true`. |

**Note**: The platforms marked as ❌ use the default value.

## Maintainers

* [Rapsssito](https://github.com/rapsssito)

## Acknowledgments

* iOS part originally forked from @aprock [react-native-tcp](https://github.com/aprock/react-native-tcp)
* [react-native-udp](https://github.com/tradle/react-native-udp)

## License

The library is released under the MIT license. For more information see [`LICENSE`](/LICENSE).
