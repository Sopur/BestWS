const arrayTypes = require("./arrays.js");

class EncodeError extends TypeError {
    /**
     * Custom encode error.
     * @param {string} message Message.
     */
    constructor(message) {
        super(message);
        this.name = "EncodeError";
    }
}

/**
 * Check if the given value is a typed array.
 * @param {any} value Value to check.
 * @returns {boolean} Result.
 */
function isTypedArray(value) {
    for (const arrayType of arrayTypes) {
        if (value instanceof arrayType) return true;
    }
    return false;
}

/**
 * Check if the given value is a arraybuffer.
 * @param {any} value Value to check.
 * @returns {boolean} Result.
 */
function isArrayBuffer(value) {
    return value instanceof ArrayBuffer || value instanceof SharedArrayBuffer;
}

module.exports = {
    EncodeError,
    isTypedArray,
    isArrayBuffer,
};
