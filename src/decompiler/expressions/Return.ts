export class Return {
	source: string = '';
	values: string[] = [];

	constructor(values: string[]) {
		this.values = values;
	}

	build(tabSize: number) {
		const tabs = '\t'.repeat(tabSize);

		this.source = tabs;
		this.source += 'return ';
		this.source += this.values.join(', ');

		return this.source;
	}
}
