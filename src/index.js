const EventEmitter = require('eventemitter3');

class PendingDatagram {
    /**
     * @param {number} totalDatagrams
     * @param {import('dgram').RemoteInfo} rinfo
     * @param {(partialPayload: string, error: Error) => void} errorCallback
     * @param {(payload: any) => void} completeCallback
     */
    constructor(totalDatagrams, rinfo, errorCallback, completeCallback) {
        this.totalDatagrams = totalDatagrams;
        /** @private @type {Map<number, string>} */
        this.payloadMap = new Map();
        this.rinfo = rinfo;
        this.errorCallback = errorCallback;
        this.completeCallback = completeCallback;
    }

    /**
     * @param {number} datagramIndex
     * @param {string} payload
     * @param {import('dgram').RemoteInfo} rinfo
     */
    addPayload(datagramIndex, payload, rinfo) {
        if (rinfo.address !== this.rinfo.address || rinfo.port !== this.rinfo.port) {
            this.errorCallback(
                this.getPayload(),
                new Error(
                    `Fragment ${datagramIndex}: RemoteInfo ${JSON.stringify(
                        rinfo
                    )} does not match initial RemoteInfo ${JSON.stringify(this.rinfo)}`
                )
            );
        }
        this.payloadMap.set(datagramIndex, payload);
        if (this.isComplete()) {
            const rawPayload = this.getPayload();
            try {
                const jsonPayload = JSON.parse(rawPayload);
                this.completeCallback(jsonPayload);
            } catch (e) {
                this.errorCallback(rawPayload, e);
            }
        }
    }

    isComplete() {
        if (this.payloadMap.size === 0) return false;
        const valueSum = Array.from(this.payloadMap.keys()).reduce((a, b) => a + b, 0);
        const correctSum = (this.totalDatagrams * (this.totalDatagrams + 1)) / 2;
        return valueSum === correctSum;
    }

    getPayload() {
        let result = '';
        for (let i = 0; i <= this.totalDatagrams; i++) {
            result += this.payloadMap.has(i) ? this.payloadMap.get(i) : '';
        }
        return result;
    }
}

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
    }

    /**
     * @param {any} obj
     * @param {number} port
     * @param {string} [address]
     * @param {(error: Error | null) => void} [callback]
     */
    send(obj, port, address, callback = () => {}) {
        let objString;
        try {
            objString = JSON.stringify(obj);
        } catch (e) {
            callback(e);
            return;
        }
        const chunks = this._getChunks(Buffer.from(objString), this.maxPayload);
        const totalDatagram = chunks.length - 1;
        const id = (Date.now() & 0xffffffff) >>> 0;
        const sendPromises = chunks.map((ch, index) => {
            return new Promise((resolve, reject) => {
                const msg = Buffer.concat([this._buildHeader(id, index, totalDatagram), ch]);
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
     * @param {number} totalDatagram
     */
    _buildHeader(id, currentDatagram, totalDatagram) {
        const header = Buffer.allocUnsafe(12);
        // ID
        header.writeUInt32BE(id);
        // Total datagram
        header.writeUInt32BE(totalDatagram, 4);
        // Current datagram
        header.writeUInt32BE(currentDatagram, 8);
        return header;
    }

    /**
     * @private
     */
    _loadListeners() {
        this.udpSocket.on('message', this._onMessage);
    }

    /**
     * @private
     */
    _onMessage = (/** @type {Buffer} */ msg, /** @type {import('dgram').RemoteInfo} */ rinfo) => {
        const { id, currentDatagram, totalDatagram, payload } = this._unwrapMessage(msg, rinfo);
        let pendingDatagram = this.idMap.get(id);
        if (pendingDatagram === undefined) {
            pendingDatagram = new PendingDatagram(
                totalDatagram,
                rinfo,
                (partialPayload, error) => this._onDatagramError(id, partialPayload, rinfo, error),
                (payload) => this._onDatagramComplete(id, payload, rinfo)
            );
            this.idMap.set(id, pendingDatagram);
        }
        pendingDatagram.addPayload(currentDatagram, payload, rinfo);
    };

    /**
     * @private
     */
    _onDatagramError = (
        /** @type {string} */ id,
        /** @type {string} */ partialPayload,
        /** @type {import('dgram').RemoteInfo} */ rinfo,
        /** @type {Error} */ error
    ) => {
        const buildError = new Error(`Error ${rinfo} payload ${partialPayload}: ${error}`);
        this.emit('message-error', buildError);
        this.idMap.delete(id);
    };

    /**
     * @private
     */
    _onDatagramComplete = (
        /** @type {string} */ id,
        /** @type {any} */ payload,
        /** @type {import('dgram').RemoteInfo} */ rinfo
    ) => {
        this.emit('message-complete', payload, rinfo);
        this.idMap.delete(id);
    };

    /**
     * @private
     * @param {Buffer} msg
     * @param {import('dgram').RemoteInfo} rinfo
     */
    _unwrapMessage(msg, rinfo) {
        const id = `${rinfo.address}:${rinfo.port}:${msg.toString('base64', 0, 4)}`;
        const totalDatagram = msg.readInt32BE(4);
        const currentDatagram = msg.readInt32BE(8);
        const payload = msg.toString('utf8', 12);
        return { id, currentDatagram, totalDatagram, payload };
    }
}

module.exports = JSONSocket;
