/**
 * Throws a bestWS error
 * @param {string} message Message to throw
 */
function ThrowError(message) {
    throw new (class extends Error {
        constructor() {
            super(message);
            this.name = "BestWS";
        }
    })();
}

module.exports = {
    bit16Limit: 65536,
    ThrowError,
};
