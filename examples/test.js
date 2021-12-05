const bws = require("../src/export.js");

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
