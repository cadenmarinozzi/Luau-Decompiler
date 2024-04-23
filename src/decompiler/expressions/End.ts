export class End {
	source: string = '';

	build(tabSize: number) {
		const tabs = '\t'.repeat(tabSize - 1);

		this.source = tabs;
		this.source += 'end';

		return {
			tabSize: tabSize - 1,
			source: this.source,
		};
	}
}
