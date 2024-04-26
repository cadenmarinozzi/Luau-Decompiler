import { Expression } from './Expression';

export class FunctionDefinition extends Expression {
	target: string = '';
	args: string[] = [];

	constructor(target: string, args: string[]) {
		super();

		this.target = target;
		this.args = args;
	}

	build(tabSize: number) {
		const { args, target } = this;

		const argsString = args.join(', ');

		this.buildTabs(tabSize);
		this.source += `function ${target}(${argsString})`;

		return {
			source: this.source,
			tabSize: tabSize + 1,
		};
	}
}
