export interface Statement {
	build(
		tabSize: number | undefined | null
	): string | { tabSize: number; source: string };
	source: string;
}
