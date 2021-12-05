const types = require("./types.js");

class Reader {
    constructor(buffer) {
        this.arrayView = new DataView(buffer);
        this.offset = 0;
    }

    get size_t() {
        let out = 0;
        let at = 0;
        while (this.arrayView.getUint8(this.offset) & 128) {
            out |= (this.u8 & 127) << at;
            at += 7;
        }
        out |= this.u8 << at;
        return out;
    }

    get i8() {
        const data = this.arrayView.getInt8(this.offset);
        this.offset += 1;
        return data;
    }

    get i16() {
        const data = this.arrayView.getInt16(this.offset);
        this.offset += 2;
        return data;
    }

    get i32() {
        const data = this.arrayView.getInt32(this.offset);
        this.offset += 4;
        return data;
    }

    get i64() {
        const data = this.arrayView.getBigInt64(this.offset);
        this.offset += 8;
        return data;
    }

    get u8() {
        const data = this.arrayView.getUint8(this.offset);
        this.offset += 1;
        return data;
    }

    get u16() {
        const data = this.arrayView.getUint16(this.offset);
        this.offset += 2;
        return data;
    }

    get u32() {
        const data = this.arrayView.getUint32(this.offset);
        this.offset += 4;
        return data;
    }

    get u64() {
        const data = this.arrayView.getBigUint64(this.offset);
        this.offset += 8;
        return data;
    }

    get f32() {
        const data = this.arrayView.getFloat32(this.offset);
        this.offset += 4;
        return data;
    }

    get f64() {
        const data = this.arrayView.getFloat64(this.offset);
        this.offset += 8;
        return data;
    }

    get string() {
        const length = this.size_t;
        let string = "";
        for (let i = 0; i < length; i++) {
            string += String.fromCharCode(this.u8);
        }
        return string;
    }
}

class Writer {
    constructor(size = 1024, reallocateSize = size) {
        this.reallocateSize = reallocateSize;
        this.memory = new ArrayBuffer(size);
        this.view = new DataView(this.memory);
        this.offset = 0;
    }

    checkSize(sizeRage) {
        if (this.offset + sizeRage >= this.memory.byteLength) {
            this.length = this.memory.byteLength + sizeRage + this.reallocateSize;
        }
    }

    set size_t(value) {
        if (value === 0) return void (this.u8 = 0);
        while (value) {
            let part = value & 127;
            value >>>= 7;
            if (value) part |= 128;
            this.u8 = part;
        }
    }

    set i8(value) {
        this.checkSize(1);
        this.view.setInt8(this.offset, value);
        this.offset += 1;
    }

    set i16(value) {
        this.checkSize(2);
        this.view.setInt16(this.offset, value);
        this.offset += 2;
    }

    set i32(value) {
        this.checkSize(4);
        this.view.setInt32(this.offset, value);
        this.offset += 4;
    }

    set i64(value) {
        this.checkSize(8);
        this.view.setBigInt64(this.offset, value);
        this.offset += 8;
    }

    set u8(value) {
        this.checkSize(1);
        this.view.setUint8(this.offset, value);
        this.offset += 1;
    }

    set u16(value) {
        this.checkSize(2);
        this.view.setUint16(this.offset, value);
        this.offset += 2;
    }

    set u32(value) {
        this.checkSize(4);
        this.view.setUint32(this.offset, value);
        this.offset += 4;
    }

    set u64(value) {
        this.checkSize(8);
        this.view.setBigUint64(this.offset, value);
        this.offset += 8;
    }

    set f32(value) {
        this.checkSize(4);
        this.view.setFloat32(this.offset, value);
        this.offset += 4;
    }

    set f64(value) {
        this.checkSize(8);
        this.view.setFloat64(this.offset, value);
        this.offset += 8;
    }

    set string(string) {
        this.checkSize(string.length);
        this.size_t = string.length;
        for (const char of string) {
            this.u8 = char.charCodeAt();
        }
    }

    set length(size) {
        const newBuffer = new Uint8Array(new ArrayBuffer(size));
        newBuffer.set(this.memory);
        this.memory = newBuffer.buffer;
        this.view = new DataView(this.memory);
    }

    get length() {
        return this.offset;
    }

    get buffer() {
        return this.memory;
    }

    finalize() {
        this.memory = this.memory.slice(0, this.offset);
    }
}

module.exports = {
    Reader,
    Writer,
};
