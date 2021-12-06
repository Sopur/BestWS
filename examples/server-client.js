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
