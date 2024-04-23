export class Add {
	source: string = '';

	a: string;
	b: string;

	constructor(a: string, b: string) {
		this.a = a;
		this.b = b;
	}

	build() {
		this.source += this.a;
		this.source += ' + ';
		this.source += this.b;

		return this.source;
	}
}
