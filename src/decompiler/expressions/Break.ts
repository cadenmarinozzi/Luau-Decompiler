export class Break {
	source: string = '';

	build(tabSize: number) {
		const tabs = '\t'.repeat(tabSize);

		this.source = tabs;
		this.source += 'break';

		return this.source;
	}
}
