# BestWS

The best WebSocket library for fast, small send size, binary protocols.<br>
Long gone is Socket.io's slow and stringified packets.<br>

### Time to use small and fast binary protocols

# Quick server-client example

```js
const bws = require("bestws");

const server = new bws.Server(bws.new.HTTP(3000));

server.on("initialize", (ws, res, init, req) => {
    console.log("Initial data received: ", init);
    res(["I", { got: "the" }, "message", 1111, [",", "you", { may: "connect" }, true]]);

    ws.on("message", (data) => {
        console.log("Got data from client: ", data);
        ws.send("Hello!");
    });
});

server.on("listening", () => {
    console.log("Listening.");
    const client = new bws.Client("ws://localhost:3000", [1, { a: "Init request data" }, 2]);
    client.on("initializing", () => console.log("Client connecting..."));
    client.on("open", (init) => {
        console.log("Server sent their own initial data: ", init);
        client.send("Hi!");
    });
    client.on("message", (data) => {
        console.log("Got data from server: ", data);
    });
});
```

# Warning

I didn't make the above work with browsers, NodeJS only.<br>

## However,<br>

Where this library shines if the encoding functionality which I haven't made in browser either, kinda too lazy for that.
Have fun.