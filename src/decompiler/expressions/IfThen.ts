import { Statement, StatementInfc } from '../statements/Statement';
import { Expression } from './Expression';

export class IfThen extends Expression {
	condition: StatementInfc;

	constructor(condition: StatementInfc) {
		super();

		this.condition = condition;
	}

	build(tabSize: number) {
		const { condition } = this;

		this.buildTabs(tabSize);
		this.source += `if ${condition.build()} then`;

		return {
			tabSize: tabSize + 1,
			source: this.source,
		};
	}
}
