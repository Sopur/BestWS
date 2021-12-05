const EventEmitter = require("events");
const WebSocket = require("ws");
const { Reader, Writer } = require("../packets/export.js");
const util = require("./util.js");
const states = require("./states.js");
const defs = require("./obj.js");

class Client extends EventEmitter {
    /**
     * Server sided client API.
     * @param {WebSocket} socket Socket to interact with.
     */
    constructor(socket) {
        super();
        socket.binaryType = "arraybuffer";
        this.state = states.INITIALIZING;
        this.streamer = socket;
        this.decoder = (message) => {
            const reader = new Reader(message);
            // Check if the client is sending an init message
            if (reader.reader.u8 !== 0) return socket.close(400);
            this.emit(
                "connection",
                (data) => {
                    const writer = new Writer();
                    writer.writer.u8 = 0;
                    writer.write(data);
                    socket.send(writer.buffer);
                },
                reader.read()
            );
            this.decoder = (message) => {
                const reader = new Reader(message);
                this.emit("message", reader.read(), reader);
            };
        };
        socket.on("message", (data, isBinary) => {
            if (isBinary === false) return socket.terminate();
            this.decoder(data);
        });
        socket.on("close", () => this.emit("close"));
        socket.on("ping", () => this.emit("ping"));
        socket.on("pong", () => this.emit("pong"));
    }

    /**
     * Encodes anything and sends it.
     * @param  {...any} args Messages to encode and send.
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
     * Throw an error
     * @param {string} reason Reason for error
     * @private
     */
    error(reason) {
        this.emit("error", reason);
    }
}

class Server extends EventEmitter {
    /**
     * WebSocket server with BestWS
     * @param {WebSocket.Server} protocol Protocol to use. Look at bws.new.http|https.
     * @param {number} timeout Timeout before the socket terminates for not sending an init packet.
     */
    constructor(protocol, timeout = 10000) {
        super();
        this.streamer = protocol;
        this.streamer.on("close", () => this.emit("close"));
        this.streamer.on("connection", (socket, request) => {
            const client = new Client(socket);
            this.emit("awaiting-client", request);
            setTimeout(() => {
                if (client.state !== states.OPEN) socket.terminate();
            }, timeout);
            client.on("connection", (res, init) => this.emit("initialize", client, res, init, request));
        });
        this.streamer.on("error", (reason) => this.error(reason));
        this.streamer.on("listening", () => this.emit("listening"));
    }

    /**
     * Close the server.
     */
    close() {
        this.streamer.close();
    }

    /**
     * Throw an error
     * @param {string} reason Reason for error
     * @private
     */
    error(reason) {
        this.emit("error", reason);
    }
}

module.exports = Server;
