const WebSocket = require("ws");
const https = require("https");
const util = require("./util.js");

/**
 * Makes a https server.
 * @param {number} port Port for the server to listen to.
 * @param {string} privateKey The private key in the https protocol.
 * @param {string} publicKey The public key in the https protocol.
 * @returns {WebSocket.Server} The WSS server.
 */
function HTTPS(port, privateKey, publicKey) {
    if (typeof privateKey !== "string" || typeof publicKey !== "string" || typeof port !== "number" || port > util.bit16Limit)
        util.ThrowError("Invalid parameters for HTTPS_OBJ.");
    const server = https.createServer({ key: this.privateKey, cert: this.publicKey });
    const wss = new WebSocket.Server({ server });
    server.listen(this.port);
    return wss;
}

/**
 * Makes a http server.
 * @param {number} port Port for the server to listen to.
 * @returns {WebSocket.Server} The WS server.
 */
function HTTP(port) {
    if (typeof port !== "number" || port > util.bit16Limit) util.ThrowError("Invalid parameters for HTTP.");
    const wss = new WebSocket.Server({ port });
    return wss;
}

module.exports = {
    HTTP,
    HTTPS,
};
