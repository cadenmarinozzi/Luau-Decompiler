export class Call {
	source: string = '';
	functionName: string = '';
	args: string[] = [];

	constructor(functionName: string, args: string[]) {
		this.functionName = functionName;
		this.args = args;
	}

	build(tabSize: number) {
		const tabs = '\t'.repeat(tabSize);

		this.source = tabs;
		this.source += this.functionName;
		this.source += '(';
		this.source += this.args.join(', ');
		this.source += ')';

		return this.source;
	}
}
