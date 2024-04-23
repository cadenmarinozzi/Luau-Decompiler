export class Assignment {
	source: string = '';

	target: string;
	value: string | undefined;

	constructor(target: string, value: string) {
		this.target = target;
		this.value = value;
	}

	build(tabSize: number) {
		const tabs = '\t'.repeat(tabSize);

		this.source = tabs;
		this.source += 'local ';
		this.source += this.target;
		this.source += ' = ';

		this.source += this.value;

		return this.source;
	}
}
