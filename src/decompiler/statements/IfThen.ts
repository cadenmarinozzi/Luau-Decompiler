import { Statement } from './Statement';

export class IfThen {
	source: string = '';
	condition: Statement;

	constructor(condition: Statement) {
		this.condition = condition;
	}

	build(tabSize: number) {
		const tabs = '\t'.repeat(tabSize);

		this.source = tabs;
		this.source += 'if ';
		this.source += this.condition.build(0);
		this.source += ' then';

		return {
			tabSize: tabSize + 1,
			source: this.source,
		};
	}
}
