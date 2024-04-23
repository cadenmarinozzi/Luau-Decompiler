import { OpProperties, Opcodes, getOpProperties } from '../enums/opcodes';
import { i32, i8 } from '../types/bytedata';

export default class Instruction {
	opcode: i32 = 0;
	name: string = '';

	a: i8 = 0;
	b: i8 = 0;
	c: i8 = 0;
	d: i32 = 0;
	e: i32 = 0;

	properties: OpProperties;

	constructor(value: i32) {
		this.opcode = value & 0xff;
		this.name = Opcodes[this.opcode];

		this.a = (value >> 8) & 0xff;
		this.b = (value >> 16) & 0xff;
		this.c = (value >> 24) & 0xff;
		this.d = value >> 16;
		this.e = value >> 8;

		this.properties = getOpProperties(this.opcode);
	}
}
