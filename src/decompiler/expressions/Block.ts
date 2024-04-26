import { Expression, ExpressionInfc } from './Expression';
import { StatementInfc } from '../statements/Statement';
import { Return } from './Return';
import { IfThen } from './IfThen';
import { End } from './End';
import { FunctionDefinition } from './FunctionDefinition';

export class Block extends Expression {
	statements: (StatementInfc | ExpressionInfc)[] = [];

	build(tabSize: number) {
		for (const [index, statement] of this.statements.entries()) {
			const statSource = statement.build(tabSize);

			if (
				statement instanceof Return ||
				statement instanceof IfThen ||
				statement instanceof FunctionDefinition
			) {
				this.source += '\n';
			}

			if (statSource instanceof Object) {
				this.source += statSource.source;
				tabSize = statSource.tabSize;
			} else {
				this.source += statSource;
			}

			if (index !== this.statements.length - 1) {
				this.source += '\n';
			}

			if (statement instanceof End) {
				this.source += '\n';
			}
		}

		return this.source;
	}
}
