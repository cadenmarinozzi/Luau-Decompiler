import { Expression } from './Expression';

export class Return extends Expression {
	values: string[] = [];

	constructor(values: string[]) {
		super();

		this.values = values;
	}

	build(tabSize: number) {
		const { values } = this;

		const valuesString = values.join(', ');

		this.buildTabs(tabSize);
		this.source += `return ${valuesString}`;

		return this.source;
	}
}
