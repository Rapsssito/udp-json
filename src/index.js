const EventEmitter = require('eventemitter3');

class PendingDatagram {
    /**
     * @param {{datagramCount: number, timeout: number}} options
     * @param {import('dgram').RemoteInfo} rinfo
     * @param {(partialPayload: string, error: Error) => void} errorCallback
     * @param {(partialPayload: string, error: Error) => void} timeoutCallback
     * @param {(payload: any) => void} completeCallback
     */
    constructor(options, rinfo, errorCallback, timeoutCallback, completeCallback) {
        this.timeout = options.timeout;
        this.datagramCount = options.datagramCount;
        /** @private @type {Map<number, string>} */
        this.payloadMap = new Map();
        this.rinfo = rinfo;
        this.errorCallback = errorCallback;
        this.timeoutCallback = timeoutCallback;
        this.completeCallback = completeCallback;
        this.currentTimeout = undefined;
    }

    /**
     * @param {number} datagramIndex
     * @param {string} payload
     */
    addPayload(datagramIndex, payload) {
        this.resetTimeout();
        this.payloadMap.set(datagramIndex, payload);
        if (this.isComplete()) {
            this.stopTimeout();
            const rawPayload = this.getPayload();
            try {
                const jsonPayload = JSON.parse(rawPayload);
                this.completeCallback(jsonPayload);
            } catch (e) {
                this.errorCallback(rawPayload, e);
            }
        }
    }

    stopTimeout() {
        if (this.currentTimeout !== undefined) clearTimeout(this.currentTimeout);
    }

    startTimeout() {
        this.currentTimeout = setTimeout(
            () => this.timeoutCallback(this.getPayload(), new Error(`Timeout: ${this.timeout}`)),
            this.timeout
        );
    }

    resetTimeout() {
        this.stopTimeout();
        this.startTimeout();
    }

    isComplete() {
        if (this.payloadMap.size !== this.datagramCount) return false;
        const valueSum = Array.from(this.payloadMap.keys()).reduce((a, b) => a + b, 0);
        const correctSum = ((this.datagramCount - 1) * this.datagramCount) / 2;
        return valueSum === correctSum;
    }

    getPayload() {
        let result = '';
        for (let i = 0; i < this.datagramCount; i++) {
            result += this.payloadMap.has(i) ? this.payloadMap.get(i) : '';
        }
        return result;
    }
}

/**
 * @typedef {'message-complete' | 'message-timeout' | 'message-error'} EventTypes
 * @extends {EventEmitter<EventTypes, any>}
 */
class JSONSocket extends EventEmitter {
    /**
     * @param {import('dgram').Socket} udpSocket
     * @param {{maxPayload?: number, timeout?: number}} [options]
     */
    constructor(udpSocket, options = {}) {
        super();
        this.udpSocket = udpSocket;
        /** @private @type {Map<string, PendingDatagram>} */
        this.idMap = new Map();
        this._loadListeners();
        this.maxPayload = options.maxPayload || 496; // 508 max safe UDP payload - 12 headers bytes = 496
        this.timeout = options.timeout || 1000;
    }

    /**
     * @param {any} obj
     * @param {number} port
     * @param {string} [address]
     * @param {(error: Error | null) => void} [callback]
     */
    send(obj, port, address, callback = () => {}) {
        const objString = JSON.stringify(obj);
        const chunks = this._getChunks(Buffer.from(objString), this.maxPayload);
        const datagramCount = chunks.length;
        const id = (Date.now() & 0xffffffff) >>> 0;
        const sendPromises = chunks.map((ch, index) => {
            return new Promise((resolve, reject) => {
                const msg = Buffer.concat([this._buildHeader(id, index, datagramCount), ch]);
                this.udpSocket.send(msg, port, address, (err) => {
                    if (err) reject(err);
                    else resolve(null);
                });
            });
        });
        Promise.all(sendPromises)
            .then(() => callback(null))
            .catch(callback);
    }

    /**
     * @private
     * @param {Buffer} buff
     * @param {number} size byte
     */
    _getChunks(buff, size) {
        const chunks = [];
        for (let startPoint = 0; startPoint < buff.length; startPoint += size) {
            const endPoint = startPoint + size > buff.length ? buff.length : startPoint + size;
            chunks.push(buff.slice(startPoint, endPoint));
        }
        return chunks;
    }

    /**
     * @private
     * @param {number} id
     * @param {number} currentDatagram
     * @param {number} datagramCount
     */
    _buildHeader(id, currentDatagram, datagramCount) {
        const header = Buffer.allocUnsafe(12);
        // ID
        header.writeUInt32BE(id);
        // Datagram count
        header.writeUInt32BE(datagramCount, 4);
        // Current datagram
        header.writeUInt32BE(currentDatagram, 8);
        return header;
    }

    /**
     * @private
     */
    _loadListeners() {
        this.udpSocket.on('message', (msg, rinfo) => this._onMessage(msg, rinfo));
    }

    /**
     * @private
     * @param {Buffer} msg
     * @param {import('dgram').RemoteInfo} rinfo
     */
    _onMessage(msg, rinfo) {
        const { id, currentDatagram, datagramCount, payload } = this._unwrapMessage(msg, rinfo);
        let pendingDatagram = this.idMap.get(id);
        if (pendingDatagram === undefined) {
            pendingDatagram = new PendingDatagram(
                { datagramCount: datagramCount, timeout: this.timeout },
                rinfo,
                (partialPayload, error) => this._onDatagramError(id, partialPayload, rinfo, error),
                (partialPayload, error) => this._onDatagramTimeout(id, partialPayload, rinfo, error),
                (payload) => this._onDatagramComplete(id, payload, rinfo)
            );
            this.idMap.set(id, pendingDatagram);
        }
        pendingDatagram.addPayload(currentDatagram, payload);
    }

    /**
     * @private
     * @param {string} id
     * @param {string} partialPayload
     * @param {import('dgram').RemoteInfo} rinfo
     * @param {Error} error
     */
    _onDatagramError(id, partialPayload, rinfo, error) {
        const buildError = new Error(`Error ${JSON.stringify(rinfo)} current payload ${partialPayload}: ${error}`);
        this.emit('message-error', buildError);
        this.idMap.delete(id);
    }

    /**
     * @private
     * @param {string} id
     * @param {string} partialPayload
     * @param {import('dgram').RemoteInfo} rinfo
     * @param {Error} error
     */
    _onDatagramTimeout(id, partialPayload, rinfo, error) {
        const buildError = new Error(`Timeout ${JSON.stringify(rinfo)} current payload ${partialPayload}: ${error}`);
        this.emit('message-timeout', buildError);
        this.idMap.delete(id);
    }

    /**
     * @private
     * @param {string} id
     * @param {any} payload
     * @param {import('dgram').RemoteInfo} rinfo
     */
    _onDatagramComplete(id, payload, rinfo) {
        this.emit('message-complete', payload, rinfo);
        this.idMap.delete(id);
    }

    /**
     * @private
     * @param {Buffer} msg
     * @param {import('dgram').RemoteInfo} rinfo
     */
    _unwrapMessage(msg, rinfo) {
        const id = `${rinfo.address}:${rinfo.port}:${msg.toString('base64', 0, 4)}`;
        const datagramCount = msg.readInt32BE(4);
        const currentDatagram = msg.readInt32BE(8);
        const payload = msg.toString('utf8', 12);
        return { id, currentDatagram, datagramCount, payload };
    }
}

module.exports = JSONSocket;
