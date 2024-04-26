export class Expression {
	source: string = '';

	buildTabs = (tabSize: number) => {
		this.source = '\t'.repeat(tabSize);
	};
}

export interface ExpressionInfc {
	source: string;
	build(
		tabSize: number | undefined | null
	): string | { tabSize: number; source: string };
}
