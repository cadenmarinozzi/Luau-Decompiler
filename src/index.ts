import fs from 'fs';
import { Bytecode } from './types/bytecode';
import deserialize from './deserializer';
import decompile from './decompiler';

const inputFile = process.argv[2];
const outputDir = process.argv[3];

if (!inputFile || !outputDir) {
	console.error('Usage: node dist/index.js <input> <output_dir>');
	process.exit(1);
}

if (!fs.existsSync(outputDir)) {
	fs.mkdirSync(outputDir);
}

fs.open(inputFile, 'r', (err, fd) => {
	if (err) throw err;

	const buffer = Buffer.alloc(1);
	const bytecode = [] as Bytecode;

	while (true) {
		const num = fs.readSync(fd, buffer, 0, 1, null);
		if (num === 0) break;

		bytecode.push(buffer[0]);
	}

	const program = deserialize(bytecode);

	const inputFileName = inputFile
		.split('/')
		.pop()
		?.split('.')
		.slice(0, -1)
		.join('.');

	fs.writeFileSync(
		`${outputDir}/${inputFileName}_deserialized.json`,
		JSON.stringify(program, null, 4)
	);
	fs.writeFileSync(
		`${outputDir}/${inputFileName}_decompiled.lua`,
		decompile(program)
	);
});
