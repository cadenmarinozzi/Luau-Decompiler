export class Statement {
	source: string = '';
}

export interface StatementInfc {
	source: string;
	build: () => string;
}
