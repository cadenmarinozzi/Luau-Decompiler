import ByteReader from '../byteReader';
import { i8, uint32 } from '../types/bytedata';
import Constant from './Constant';
import Instruction from './Instruction';
import { ConstantType } from '../enums/constants';

export default class Function {
	nParams: i8 = 0;
	isVararg: boolean = false;
	maxStackSize: i8 = 0;
	nUpvalues: i8 = 0;
	flags: i8 = 0;

	nTypeInfo: uint32 = 0;
	typeinfo: string = '';

	nInstructions: uint32 = 0;
	instructions: Instruction[] = [];

	nConstants: uint32 = 0;
	constants: Constant[] = [];

	nFunctions: uint32 = 0;
	functions: uint32[] = [];

	lineDefined: uint32 = 0;
	debugName: uint32 = 0;

	deserialize(reader: ByteReader) {
		this.maxStackSize = reader.readInt8();
		this.nParams = reader.readInt8();
		this.nUpvalues = reader.readInt8();
		this.isVararg = reader.readBool();
		this.flags = reader.readInt8();

		this.deserializeTypeInfo(reader);
		this.deserializeInstructions(reader);
		this.deserializeConstants(reader);

		const nFunctions = reader.readVarInt32();
		this.nFunctions = nFunctions;

		const functions = [];

		for (let i = 0; i < nFunctions; i++) {
			const func = reader.readVarInt32();
			functions.push(func);
		}

		this.lineDefined = reader.readVarInt32();
		this.debugName = reader.readVarInt32();

		if (reader.readBool()) {
			const lineGap = reader.readInt8();

			for (let i = 0; i < this.instructions.length; i++) {
				reader.readInt8();
			}

			const nIntervals = ((this.instructions.length - 1) >> lineGap) + 1;

			for (let i = 0; i < nIntervals; i++) {
				reader.readInt32();
			}
		}

		if (reader.readBool()) {
			const nLocals = reader.readVarInt32();

			for (let i = 0; i < nLocals; i++) {
				reader.readVarInt32(),
					reader.readVarInt32(),
					reader.readVarInt32(),
					reader.readInt8();
			}

			const nUpvalues = reader.readVarInt32();

			for (let i = 0; i < nUpvalues; i++) {
				reader.readVarInt32();
			}
		}
	}

	deserializeTypeInfo(reader: ByteReader) {
		const nTypeInfo = reader.readVarInt32();
		this.nTypeInfo = nTypeInfo;

		let typeinfo = '';

		for (let j = 0; j < nTypeInfo; j++) {
			typeinfo += reader.readInt8().toString();
		}

		this.typeinfo = typeinfo;
	}

	deserializeInstructions(reader: ByteReader) {
		const nInstructions = reader.readVarInt32();
		this.nInstructions = nInstructions;

		for (let j = 0; j < nInstructions; j++) {
			const packed = reader.readInt32();

			const instruction = new Instruction(packed);
			this.instructions.push(instruction);

			if (!instruction.properties.hasAux) {
				continue;
			}

			const auxPacked = reader.readInt32();

			const aux = new Instruction(auxPacked);
			this.instructions.push(aux);

			j++;
		}
	}

	deserializeConstants(reader: ByteReader) {
		const nConstants = reader.readVarInt32();
		this.nConstants = nConstants;

		for (let j = 0; j < nConstants; j++) {
			const constant = new Constant();

			const type = reader.readInt8();
			constant.type = type;

			switch (type) {
				case ConstantType.TYPE_NIL:
					constant.value = null;

					break;

				case ConstantType.TYPE_BOOLEAN:
					constant.value = reader.readBool();

					break;

				case ConstantType.TYPE_NUMBER:
					constant.value = reader.readFloat64();

					break;

				case ConstantType.TYPE_VECTOR:
					constant.value = [
						reader.readFloat32(),
						reader.readFloat32(),
						reader.readFloat32(),
						reader.readFloat32(),
					];

					break;

				case ConstantType.TYPE_STRING:
					constant.value = reader.readVarInt32();

					break;

				case ConstantType.TYPE_IMPORT:
					const index = reader.readInt32();
					const nImports = index >> 30;

					const imports = [];
					let shift = 20;

					for (let k = 0; k < nImports; k++) {
						imports.push((index >> shift) & 0x3ff);
						shift -= 10;
					}

					constant.value = imports;

					break;

				case ConstantType.TYPE_CLOSURE:
					constant.value = reader.readVarInt32();

					break;

				case ConstantType.TYPE_TABLE:
					const table = [];

					const tableSize = reader.readVarInt32();

					for (let k = 0; k < tableSize; k++) {
						const key = reader.readVarInt32();

						table.push(key);
					}

					constant.value = table;

					break;

				default:
					throw new Error(`Unsupported constant type: ${type}`);

					break;
			}

			this.constants.push(constant);
		}
	}
}
