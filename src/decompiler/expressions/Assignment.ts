import { Expression } from './Expression';

export class Assignment extends Expression {
	target: string;
	value: string | undefined;

	constructor(target: string, value: string) {
		super();

		this.target = target;
		this.value = value;
	}

	build(tabSize: number) {
		const { target, value } = this;

		this.buildTabs(tabSize);
		this.source += `local ${target} = ${value}`;

		return this.source;
	}
}
