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
