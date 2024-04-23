export class Not {
	source: string = '';

	value: string;

	constructor(value: string) {
		this.value = value;
	}

	build() {
		this.source += 'not';
		this.source += '(';
		this.source += this.value;
		this.source += ')';

		return this.source;
	}
}
