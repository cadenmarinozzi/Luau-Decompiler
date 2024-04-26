import { Bytecode } from '../types/bytecode';
import Program from './Program';
import ByteReader from '../byteReader';

export default function deserialize(bytecode: Bytecode): Program {
	const reader = new ByteReader(bytecode);
	const program = new Program();

	program.deserialize(reader);

	return program;
}
