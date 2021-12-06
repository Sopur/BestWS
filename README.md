# BestWS

The best WebSocket library for fast, small send size, binary protocols.<br>
Long gone is Socket.io's slow and stringified packets.<br>

## Time to use small and fast binary protocols

# Quick server-client example

```js
const bws = require("../src/export.js");

// Create the server.
const server = new bws.Server(bws.new.HTTP(3000));

// When a client requests an initialize response:
server.on("initialize", (ws, res, init, req) => {
    console.log("Initial data received: ", init);

    // Give back this data and a initialize response.
    res(["I", { got: "the" }, "message", 1111, [",", "you", { may: "connect" }, true]]);

    // Handle the client:
    ws.on("message", (data) => {
        console.log("Got data from client: ", data);
        ws.send("Hello!");
    });
});

server.on("listening", () => {
    // Try to connect the client when the server is listing.
    console.log("Listening.");

    // Connect the client sending that init data.
    const client = new bws.Client("ws://localhost:3000", [1, { a: "Init request data" }, 2]);

    // When the socket has opened and a init packet is requesting:
    client.on("initializing", () => console.log("Client connecting..."));

    // When everything is finalized:
    client.on("open", (init) => {
        console.log("Server sent their own initial data: ", init);

        // Send the server a message once connected.
        client.send("Hi!");
    });

    // Log the data when the server sends a message.
    client.on("message", (data) => {
        console.log("Got data from server: ", data);
    });
});
```

# Where this library shines

The variables/class stored in `BestWS.buffer` is what makes this library shine. <br>
The encoding and binary functionality is beyond every other library on npm, especially Socket.io. <br>
The socket part is just a wrapper mostly of node ws.

# Documentation

All documentation shown below will be only the binary/encoding functionality, for the rest just look at the source or examples.

## Encoding to a buffer/binary

```js
const bestEncoder = require("../src/export.js").buffer;

// Allocate 1000 bytes initially.
const writer = new bestEncoder.Writer(1000);

// Data to be encoded.
const data = {
    hello: "byte",
    one: 2,
    3: "four",
    array: [
        5,
        {
            object: true,
        },
        6,
        false,
        true,
        [7, 8],
    ],
    buffer: new Uint8Array([9, 10, 11, 12]),
    float: 13.1,
};

// Write it in the writer.
writer.write(data);

// Get the binary data.
const encoded = writer.buffer;

// Reader the binary data.
const reader = new bestEncoder.Reader(encoded);

// Get the contents.
const decoded = reader.read();

decoded === data; // True
```

## Bi-encoding data

```js
const bestEncoder = require("../src/export.js").buffer;

// Allocate 1000 bytes initially
const writer = new bestEncoder.Writer(1000);

// In the first slot, make a normal object.
writer.write({
    object: true,
    array: false,
});

// In the second one, make a normal array.
writer.write([false, true]);

const reader = new bestEncoder.Reader(writer.buffer);

reader.read(); // Get the object stored in the first slot.
reader.read(); // Get the array stored in the second slot.

/**
 * Of course you don't need to do this and just make an array including everything you want
 * However, this is still an option.
 */
```

# Warning

I didn't make the above work with browsers, NodeJS only.<br>

# Please!

If you want to, make this protocol or encoder in your own language. <br>
Eventually the horrors and optimized garbage that is socket.io will disappear.
