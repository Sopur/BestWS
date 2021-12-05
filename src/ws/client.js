const EventEmitter = require("events");
const WebSocket = require("ws");
const { Reader, Writer } = require("../packets/export.js");
const states = require("./states.js");

class Client extends EventEmitter {
    /**
     * BestWS client.
     * @param {string} url URL to connect to.
     * @param {any} initPacket The packet to send to the server in the init handshake.
     * @param {WebSocket.ClientOptions} headers WS options.
     */
    constructor(url, initPacket, headers) {
        super();
        this.state = states.OPENING;
        this.decoder = (message) => {
            // Init packet decoder
            if (this.state !== states.INITIALIZING) return this.error("Client tried to initialize while already initialized.", true);
            const reader = new Reader(message);
            if (reader.reader.u8 !== 0) return this.error("Server sent an invalid init header", true);
            this.emit("open", reader.read());
            this.decoder = (message) => {
                const reader = new Reader(message);
                this.emit("message", reader.read(), reader);
            };
        };
        this.streamer = new WebSocket(url, headers);
        this.streamer.binaryType = "arraybuffer";
        this.streamer.on("close", () => {
            this.streamer.terminate();
            this.state = states.CLOSED;
            this.emit("close");
        });
        this.streamer.on("message", (data, isBinary) => {
            if (isBinary === false) return this.error("Unexpected server message of invalid type");
            this.decoder(data);
        });
        this.streamer.on("open", () => {
            // Do the init packet
            this.state = states.INITIALIZING;
            this.emit("initializing");

            const encoder = new Writer();
            encoder.writer.u8 = 0; // Show that this is an init packet
            encoder.write(initPacket);
            this.streamer.send(encoder.buffer);
        });
        this.streamer.on("ping", () => this.emit("ping"));
        this.streamer.on("pong", () => this.emit("pong"));
    }

    /**
     * Send any data to the server that will be encoded.
     * @param  {...any} args The data to encode.
     * @returns {void}
     */
    send(...args) {
        if (args.length <= 0) return this.error("Not enough args to send data");
        const writer = new Writer(args.length * 1028);
        writer.write(...args);
        this.streamer.send(writer.buffer);
    }

    /**
     * Pings the server.
     */
    ping() {
        this.streamer.ping();
    }

    /**
     * Closes the server.
     */
    close() {
        this.streamer.close();
    }

    /**
     * Terminates the server without any other protocol.
     */
    destroy() {
        this.streamer.terminate();
    }

    /**
     * Throws an error or Unexpected response error.
     * @param {string} reason Reason for the error.
     * @param {boolean} unexpected If it was an Unexpected response or a normal error
     */
    error(reason, unexpected = false) {
        if (unexpected === true) this.emit("unexpected-response", reason);
        else this.emit("error", reason);
    }
}

module.exports = Client;
