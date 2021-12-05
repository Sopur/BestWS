module.exports = {
    Client: require("./ws/client.js"),
    Server: require("./ws/server.js"),
    buffer: require("./packets/export.js"),
    STATES: require("./ws/states.js"),
    new: require("./ws/obj.js"),
    typedef: {
        types: require("./packets/types.js"),
        limits: require("./packets/limits.js"),
    },
};
