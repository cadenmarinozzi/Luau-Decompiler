import { Expression } from './Expression';

export class Call extends Expression {
	functionName: string = '';
	args: string[] = [];

	constructor(functionName: string, args: string[]) {
		super();

		this.functionName = functionName;
		this.args = args;
	}

	build(tabSize: number) {
		const { args, functionName } = this;

		const argsString = args.join(', ');

		this.buildTabs(tabSize);
		this.source += `${functionName}(${argsString})`;

		return this.source;
	}
}
