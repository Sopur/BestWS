void(function(exportObject,name){{var arrayTypes=[Int8Array,Int16Array,Int32Array,BigInt64Array,Uint8Array,Uint16Array,Uint32Array,BigUint64Array,Float32Array,Float64Array,Uint8ClampedArray,]}
{let i=0;var types={UNSET:i++,U8:i++,U16:i++,U32:i++,U64:i++,I8:i++,I16:i++,I32:i++,I64:i++,F32:i++,F64:i++,ARRAY:i++,OBJECT:i++,BUFFER:i++,BOOL_FALSE:i++,BOOL_TRUE:i++,CHARACTER:i++,STRING:i++,NULL:i++,}}
{var limits={I8:128,I16:32768,I32:2147483648,U8:256,U16:65536,U32:4294967296,}}
{class EncodeError extends TypeError{constructor(message){super(message);this.name="EncodeError"}}
function isTypedArray(value){for(const arrayType of arrayTypes){if(value instanceof arrayType)return!0}
return!1}
function isArrayBuffer(value){return value instanceof ArrayBuffer}
var util={EncodeError,isTypedArray,isArrayBuffer,}}
{class Reader{constructor(buffer){this.arrayView=new DataView(buffer);this.offset=0}
get size_t(){let out=0;let at=0;while(this.arrayView.getUint8(this.offset)&128){out|=(this.u8&127)<<at;at+=7}
out|=this.u8<<at;return out}
get i8(){const data=this.arrayView.getInt8(this.offset);this.offset+=1;return data}
get i16(){const data=this.arrayView.getInt16(this.offset);this.offset+=2;return data}
get i32(){const data=this.arrayView.getInt32(this.offset);this.offset+=4;return data}
get i64(){const data=this.arrayView.getBigInt64(this.offset);this.offset+=8;return data}
get u8(){const data=this.arrayView.getUint8(this.offset);this.offset+=1;return data}
get u16(){const data=this.arrayView.getUint16(this.offset);this.offset+=2;return data}
get u32(){const data=this.arrayView.getUint32(this.offset);this.offset+=4;return data}
get u64(){const data=this.arrayView.getBigUint64(this.offset);this.offset+=8;return data}
get f32(){const data=this.arrayView.getFloat32(this.offset);this.offset+=4;return data}
get f64(){const data=this.arrayView.getFloat64(this.offset);this.offset+=8;return data}
get string(){const length=this.size_t;let string="";for(let i=0;i<length;i++){string+=String.fromCharCode(this.u8)}
return string}}
class Writer{constructor(size=1024,reallocateSize=size){this.reallocateSize=reallocateSize;this.memory=new ArrayBuffer(size);this.view=new DataView(this.memory);this.offset=0}
checkSize(sizeRage){if(this.offset+sizeRage>=this.memory.byteLength){this.length=this.memory.byteLength+sizeRage+this.reallocateSize}}
set size_t(value){if(value===0)return void(this.u8=0);while(value){let part=value&127;value>>>=7;if(value)part|=128;this.u8=part}}
set i8(value){this.checkSize(1);this.view.setInt8(this.offset,value);this.offset+=1}
set i16(value){this.checkSize(2);this.view.setInt16(this.offset,value);this.offset+=2}
set i32(value){this.checkSize(4);this.view.setInt32(this.offset,value);this.offset+=4}
set i64(value){this.checkSize(8);this.view.setBigInt64(this.offset,value);this.offset+=8}
set u8(value){this.checkSize(1);this.view.setUint8(this.offset,value);this.offset+=1}
set u16(value){this.checkSize(2);this.view.setUint16(this.offset,value);this.offset+=2}
set u32(value){this.checkSize(4);this.view.setUint32(this.offset,value);this.offset+=4}
set u64(value){this.checkSize(8);this.view.setBigUint64(this.offset,value);this.offset+=8}
set f32(value){this.checkSize(4);this.view.setFloat32(this.offset,value);this.offset+=4}
set f64(value){this.checkSize(8);this.view.setFloat64(this.offset,value);this.offset+=8}
set string(string){this.checkSize(string.length);this.size_t=string.length;for(const char of string){this.u8=char.charCodeAt()}}
set length(size){const newBuffer=new Uint8Array(new ArrayBuffer(size));newBuffer.set(this.memory);this.memory=newBuffer.buffer;this.view=new DataView(this.memory)}
get length(){return this.offset}
get buffer(){return this.memory}
finalize(){this.memory=this.memory.slice(0,this.offset)}}
var spb={Reader,Writer,}}
{var Reader=class Reader{constructor(buffer){this.reader=new spb.Reader(buffer)}
read(){switch(this.reader.u8){case types.UNSET:{return}
case types.U8:{return this.reader.u8}
case types.U16:{return this.reader.u16}
case types.U32:{return this.reader.u32}
case types.U64:{return this.reader.u64}
case types.I8:{return this.reader.i8}
case types.I16:{return this.reader.i16}
case types.I32:{return this.reader.i32}
case types.I64:{return this.reader.i64}
case types.F32:{return this.reader.f32}
case types.F64:{return this.reader.f64}
case types.ARRAY:{let values=[];const length=this.reader.size_t;for(let i=0;i<length;i++)values.push(this.read());return values}
case types.OBJECT:{let values={};const length=this.reader.size_t;for(let i=0;i<length;i++)values[this.read()]=this.read();return values}
case types.BUFFER:{const length=this.reader.size_t;const buffer=new ArrayBuffer(length);const view=new DataView(buffer);let offset=0;while(offset<length){if(length-offset>=8){view.setBigUint64(offset,this.reader.u64);offset+=8}else{view.setUint8(offset,this.reader.u8);offset+=1}}
return buffer}
case types.BOOL_FALSE:{return!1}
case types.BOOL_TRUE:{return!0}
case types.CHARACTER:{return String.fromCharCode(this.reader.u8)}
case types.STRING:{return this.reader.string}
case types.NULL:{return null}}}}}
{const{EncodeError,isTypedArray,isArrayBuffer}=util;var Writer=class Writer{constructor(size=1028){this.writer=new spb.Writer(size)}
write(data){switch(typeof(data??undefined)){case "bigint":{this.writer.u8=types.I64;this.writer.i64=data;break}
case "boolean":{this.writer.u8=types.BOOL_FALSE+data;break}
case "number":{if(isNaN(data)===!0){this.writer.u8=types.NULL;break}
if(Number.isInteger(data)===!1){this.writer.u8=types.F64;this.writer.f64=data;break}
if(data<0){data=Math.abs(data);if(data<limits.I8){this.writer.u8=types.I8;this.writer.i8=data}else if(data<limits.I16){this.writer.u8=types.I16;this.writer.i16=data}else if(data<limits.I32){this.writer.u8=types.I32;this.writer.i32=data}else{this.writer.u8=types.I64;this.writer.i64=BigInt(data)}}else{if(data<limits.U8){this.writer.u8=types.U8;this.writer.u8=data}else if(data<limits.U16){this.writer.u8=types.U16;this.writer.u16=data}else if(data<limits.U32){this.writer.u8=types.U32;this.writer.u32=data}else{this.writer.u8=types.U64;this.writer.u64=BigInt(data)}}
break}
case "object":{if(Array.isArray(data)){this.writer.u8=types.ARRAY;this.writer.size_t=data.length;for(const value of data)this.write(value);break}
if(isTypedArray(data))data=data.buffer;if(isArrayBuffer(data)){const view=new DataView(data);let offset=0;this.writer.u8=types.BUFFER;this.writer.size_t=view.byteLength;while(offset<view.byteLength){if(view.byteLength-offset>=8){this.writer.u64=view.getBigUint64(offset);offset+=8}else{this.writer.u8=view.getUint8(offset);offset+=1}}
break}
this.writer.u8=types.OBJECT;this.writer.size_t=Object.keys(data).length;for(const value in data){this.write(value);this.write(data[value])}
break}
case "string":{if(data.length<=1){this.writer.u8=types.CHARACTER;this.writer.u8=(data[0]??"\x00").charCodeAt();break}
this.writer.u8=types.STRING;this.writer.string=data;break}
case "symbol":case "function":case "undefined":{this.writer.u8=types.NULL;break}
default:{throw new EncodeError(`Cannot encode a ${typeof data}.`)}}}
get buffer(){this.writer.finalize();return this.writer.buffer}}}
{exportObject[name]={Writer:Writer,Reader:Reader,raw:spb,TypedArrays:arrayTypes,Limits:limits,}}})(typeof module==="undefined"?window:module?.exports??window,"BWSE")
