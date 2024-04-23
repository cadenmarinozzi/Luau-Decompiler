import { f32, f64, uint32, i32, i64, i8 } from '../types/bytedata';
import { Bytecode } from '../types/bytecode';

class ByteReader {
	bytecode: Bytecode;
	position: number;

	constructor(bytecode: Bytecode) {
		this.bytecode = bytecode;
		this.position = 0;
	}

	readInt8(): i8 {
		return this.bytecode[this.position++];
	}

	readVarInt32(): uint32 {
		let byte;
		let result = 0 as uint32;
		let shift = 0 as uint32;

		while (true) {
			byte = this.readInt8() as uint32;
			result |= ((byte & 0x7f) << shift) as uint32;
			shift += 7 as uint32;

			if ((byte & 0x80) === 0) {
				break;
			}
		}

		return result;
	}

	readBool(): boolean {
		return this.readInt8() === 1;
	}

	readInt32(): i32 {
		const value = this.bytecode.slice(this.position, this.position + 4);
		this.position += 4;

		const view = new DataView(new ArrayBuffer(4));

		view.setUint8(0, value[0]);
		view.setUint8(1, value[1]);
		view.setUint8(2, value[2]);
		view.setUint8(3, value[3]);

		return view.getInt32(0, true);
	}

	readFloat32(): f32 {
		const value = this.bytecode.slice(this.position, this.position + 4);
		this.position += 4;

		const view = new DataView(new ArrayBuffer(4));

		view.setUint8(0, value[0]);
		view.setUint8(1, value[1]);
		view.setUint8(2, value[2]);
		view.setUint8(3, value[3]);

		return view.getFloat32(0, true);
	}

	readFloat64(): f64 {
		const value = this.bytecode.slice(this.position, this.position + 8);
		this.position += 8;

		const view = new DataView(new ArrayBuffer(8));

		view.setUint8(0, value[0]);
		view.setUint8(1, value[1]);
		view.setUint8(2, value[2]);
		view.setUint8(3, value[3]);
		view.setUint8(4, value[4]);
		view.setUint8(5, value[5]);
		view.setUint8(6, value[6]);
		view.setUint8(7, value[7]);

		return view.getFloat64(0, true);
	}
}

export default ByteReader;
