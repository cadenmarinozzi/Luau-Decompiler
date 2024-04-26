import { Statement } from './Statement';

export class Add extends Statement {
	a: string;
	b: string;

	constructor(a: string, b: string) {
		super();

		this.a = a;
		this.b = b;
	}

	build() {
		const { a, b } = this;

		this.source = `${a} + ${b}`;

		return this.source;
	}
}
