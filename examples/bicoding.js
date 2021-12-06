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
