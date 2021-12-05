const spb = require("./spb.js");
const type = require("./types.js");

class Reader {
    /**
     * BestWS decoder/reader,
     * @param {ArrayBuffer} buffer Buffer to read from.
     */
    constructor(buffer) {
        this.reader = new spb.Reader(buffer);
    }

    /**
     * Read from the data.
     * @returns {any} Data.
     */
    read() {
        switch (this.reader.u8) {
            case type.UNSET: {
                return;
            }
            case type.U8: {
                return this.reader.u8;
            }
            case type.U16: {
                return this.reader.u16;
            }
            case type.U32: {
                return this.reader.u32;
            }
            case type.U64: {
                return this.reader.u64;
            }
            case type.I8: {
                return this.reader.i8;
            }
            case type.I16: {
                return this.reader.i16;
            }
            case type.I32: {
                return this.reader.i32;
            }
            case type.I64: {
                return this.reader.i64;
            }
            case type.F32: {
                return this.reader.f32;
            }
            case type.F64: {
                return this.reader.f64;
            }
            case type.ARRAY: {
                let values = [];
                const length = this.reader.size_t;
                for (let i = 0; i < length; i++) values.push(this.read());
                return values;
            }
            case type.OBJECT: {
                let values = {};
                const length = this.reader.size_t;
                for (let i = 0; i < length; i++) values[this.read()] = this.read();
                return values;
            }
            case type.BUFFER: {
                const length = this.reader.size_t;
                const buffer = new ArrayBuffer(length);
                const view = new DataView(buffer);
                let offset = 0;
                while (offset < length) {
                    // Copy 8 bytes at a time, otherwise copy one at a time
                    if (length - offset >= 8) {
                        view.setBigUint64(offset, this.reader.u64);
                        offset += 8;
                    } else {
                        view.setUint8(offset, this.reader.u8);
                        offset += 1;
                    }
                }
                return buffer;
            }
            case type.BOOL_FALSE: {
                return false;
            }
            case type.BOOL_TRUE: {
                return true;
            }
            case type.CHARACTER: {
                return String.fromCharCode(this.reader.u8);
            }
            case type.STRING: {
                return this.reader.string;
            }
            case type.NULL: {
                return null;
            }
        }
    }
}

module.exports = Reader;
