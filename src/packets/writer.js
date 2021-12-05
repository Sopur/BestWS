const { EncodeError, isTypedArray, isArrayBuffer } = require("./util.js");
const spb = require("./spb.js");
const type = require("./types.js");
const limits = require("./limits.js");

class Writer {
    /**
     * BestWS encoder/writer.
     * @param {number} size Size to allocate initially.
     */
    constructor(size = 1028) {
        this.writer = new spb.Writer(size);
    }

    /**
     * Write data to a buffer in memory.
     * @param {any} data Any data to be encoded.
     */
    write(data) {
        switch (typeof (data ?? undefined)) {
            case "bigint": {
                this.writer.u8 = type.I64;
                this.writer.i64 = data;
                break;
            }
            case "boolean": {
                this.writer.u8 = type.BOOL_FALSE + data;
                break;
            }
            case "number": {
                if (isNaN(data) === true) {
                    this.writer.u8 = type.NULL;
                    break;
                }
                if (Number.isInteger(data) === false) {
                    this.writer.u8 = type.F32;
                    this.writer.f32 = data;
                    break;
                }
                if (data < 0) {
                    data = Math.abs(data);
                    if (data < limits.I8) {
                        this.writer.u8 = type.I8;
                        this.writer.i8 = data;
                    } else if (data < limits.I16) {
                        this.writer.u8 = type.I16;
                        this.writer.i16 = data;
                    } else if (data < limits.I32) {
                        this.writer.u8 = type.I32;
                        this.writer.i32 = data;
                    } else {
                        this.writer.u8 = type.I64;
                        this.writer.i64 = BigInt(data);
                    }
                } else {
                    if (data < limits.U8) {
                        this.writer.u8 = type.U8;
                        this.writer.u8 = data;
                    } else if (data < limits.U16) {
                        this.writer.u8 = type.U16;
                        this.writer.u16 = data;
                    } else if (data < limits.U32) {
                        this.writer.u8 = type.U32;
                        this.writer.u32 = data;
                    } else {
                        this.writer.u8 = type.U64;
                        this.writer.u64 = BigInt(data);
                    }
                }
                break;
            }
            case "object": {
                if (Array.isArray(data)) {
                    this.writer.u8 = type.ARRAY;
                    this.writer.size_t = data.length;
                    for (const value of data) this.write(value);
                    break;
                }

                // In case it's a Buffer/TypedArray
                if (isTypedArray(data) || Buffer.isBuffer(data)) data = data.buffer;
                if (isArrayBuffer(data)) {
                    const view = new DataView(data);
                    let offset = 0;
                    this.writer.u8 = type.BUFFER;
                    this.writer.size_t = view.byteLength;
                    while (offset < view.byteLength) {
                        // Copy 8 bytes at a time, otherwise copy one at a time
                        if (view.byteLength - offset >= 8) {
                            this.writer.u64 = view.getBigUint64(offset);
                            offset += 8;
                        } else {
                            this.writer.u8 = view.getUint8(offset);
                            offset += 1;
                        }
                    }
                    break;
                }

                // Otherwise it's a normal object
                this.writer.u8 = type.OBJECT;
                this.writer.size_t = Object.keys(data).length;
                for (const value in data) {
                    this.write(value); // Write the key
                    this.write(data[value]); // Write the actual value
                }
                break;
            }
            case "string": {
                if (data.length <= 1) {
                    this.writer.u8 = type.CHARACTER;
                    this.writer.u8 = (data[0] ?? "\x00").charCodeAt();
                    break;
                }
                this.writer.u8 = type.STRING;
                this.writer.string = data;
                break;
            }

            case "symbol":
            case "function":
            case "undefined": {
                this.writer.u8 = type.NULL;
                break;
            }
            default: {
                throw new EncodeError(`Cannot encode a ${typeof data}.`);
            }
        }
    }

    /**
     * Get the buffer from the writer.
     */
    get buffer() {
        this.writer.finalize();
        return this.writer.buffer;
    }
}

module.exports = Writer;
