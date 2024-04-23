export class FunctionDefinition {
	source: string = '';
	target: string = '';

	args: string[] = [];

	constructor(target: string, args: string[]) {
		this.target = target;
		this.args = args;
	}

	build(tabSize: number) {
		const tabs = '\t'.repeat(tabSize);

		this.source = tabs;
		this.source += 'function ';
		this.source += this.target;
		this.source += '(';
		this.source += this.args.join(', ');
		this.source += ')';

		return {
			source: this.source,
			tabSize: tabSize + 1,
		};
	}
}
