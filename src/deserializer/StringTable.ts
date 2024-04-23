import { i8 } from '../types/bytecode';

export default class StringTable extends Array {
	strings: string[] = [];

	getFromId(id: i8): string {
		return this.strings[id - 1];
	}

	add(str: string) {
		this.strings.push(str);
	}

	toString(): string {
		return this.strings.toString();
	}
}
