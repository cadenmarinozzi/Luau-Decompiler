import ByteReader from '../byteReader';
import { Bytecode } from '../types/bytecode';
import Program from './Program';

export default function deserialize(bytecode: Bytecode): Program {
	const reader = new ByteReader(bytecode);
	const program = new Program();

	program.deserialize(reader);

	return program;
}
