import { IfThen } from '../statements/IfThen';
import { Statement } from '../statements/Statement';
import { End } from './End';
import { Return } from './Return';

export class Block {
	source: string = '';
	statements: Statement[] = [];

	build(tabSize: number) {
		for (const [index, statement] of this.statements.entries()) {
			const statSource = statement.build(tabSize);

			if (statement instanceof Return || statement instanceof IfThen) {
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
