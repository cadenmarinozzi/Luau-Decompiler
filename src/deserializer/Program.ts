import ByteReader from '../byteReader';
import { i8, uint32 } from '../types/bytedata';
import Function from './Function';
import StringTable from './StringTable';

export default class Program {
	version: i8 | undefined;
	typesVersion: i8 | undefined;

	nStrings: uint32 = 0;
	stringTable: StringTable = new StringTable();

	nFunctions: uint32 = 0;
	functions: Function[] = [];

	mainFunction: uint32 | undefined;

	deserialize(reader: ByteReader) {
		const version = reader.readInt8();

		if (version !== 5) {
			throw new Error(`Unsupported Lua version: ${version}`);
		}

		this.version = version;

		const typesVersion = reader.readInt8();

		if (typesVersion !== 1) {
			throw new Error(`Unsupported types version: ${typesVersion}`);
		}

		this.typesVersion = typesVersion;

		this.deserializeStringTable(reader);
		this.deserializeFunctions(reader);

		const mainFunction = reader.readVarInt32();
		this.mainFunction = mainFunction;
	}

	deserializeStringTable(reader: ByteReader) {
		const nStrings = reader.readVarInt32();
		this.nStrings = nStrings;

		for (let i = 0; i < nStrings; i++) {
			const length = reader.readVarInt32();
			const string = Buffer.from(
				reader.bytecode.slice(reader.position, reader.position + length)
			).toString('utf8');

			reader.position += length;

			this.stringTable.add(string);
		}
	}

	deserializeFunctions(reader: ByteReader) {
		const nFunctions = reader.readVarInt32();
		this.nFunctions = nFunctions;

		for (let i = 0; i < nFunctions; i++) {
			const func = new Function();
			func.deserialize(reader);

			this.functions.push(func);
		}
	}
}
