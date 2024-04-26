import { Statement } from './Statement';

export class Not extends Statement {
	value: string;

	constructor(value: string) {
		super();

		this.value = value;
	}

	build() {
		const { value } = this;

		this.source = `not(${value})`;

		return this.source;
	}
}
