/// <reference types="node" />
export = JSONSocket;
/**
 * @typedef {'message-complete' | 'message-timeout' | 'message-error'} EventTypes
 * @extends {EventEmitter<EventTypes, any>}
 */
declare class JSONSocket extends EventEmitter<EventTypes, any> {
    /**
     * @param {import('dgram').Socket} udpSocket
     * @param {{maxPayload?: number, timeout?: number}} [options]
     */
    constructor(udpSocket: import('dgram').Socket, options?: {
        maxPayload?: number | undefined;
        timeout?: number | undefined;
    } | undefined);
    udpSocket: import("dgram").Socket;
    /** @private @type {Map<string, PendingDatagram>} */
    private idMap;
    maxPayload: number;
    timeout: number;
    /**
     * @param {any} obj
     * @param {number} port
     * @param {string} [address]
     * @param {(error: Error | null) => void} [callback]
     */
    send(obj: any, port: number, address?: string | undefined, callback?: ((error: Error | null) => void) | undefined): void;
    /**
     * @private
     * @param {Buffer} buff
     * @param {number} size byte
     */
    private _getChunks;
    /**
     * @private
     * @param {number} id
     * @param {number} currentDatagram
     * @param {number} datagramCount
     */
    private _buildHeader;
    /**
     * @private
     */
    private _loadListeners;
    /**
     * @private
     */
    private _onMessage;
    /**
     * @private
     */
    private _onDatagramError;
    /**
     * @private
     */
    private _onDatagramTimeout;
    /**
     * @private
     */
    private _onDatagramComplete;
    /**
     * @private
     * @param {Buffer} msg
     * @param {import('dgram').RemoteInfo} rinfo
     */
    private _unwrapMessage;
}
declare namespace JSONSocket {
    export { EventTypes };
}
type EventTypes = "message-complete" | "message-timeout" | "message-error";
import EventEmitter = require("eventemitter3");
