import { Expression } from './Expression';

export class End extends Expression {
	build(tabSize: number) {
		this.buildTabs(tabSize - 1);
		this.source += 'end';

		return {
			tabSize: tabSize - 1,
			source: this.source,
		};
	}
}
