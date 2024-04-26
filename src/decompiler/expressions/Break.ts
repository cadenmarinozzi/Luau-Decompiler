import { Expression } from './Expression';

export class Break extends Expression {
	build(tabSize: number) {
		this.buildTabs(tabSize);
		this.source += 'break';

		return this.source;
	}
}
