import { ConstantType } from '../../enums/constants';
import { Statement } from './Statement';

export class Constant extends Statement {
	value: any;
	type: ConstantType;

	ignoreQuotes: boolean | undefined;

	constructor(value: any, type: ConstantType, ignoreQuotes?: boolean) {
		super();

		this.value = value;
		this.type = type;
		this.ignoreQuotes = ignoreQuotes;
	}

	build() {
		const { type, value, ignoreQuotes } = this;

		switch (type) {
			case ConstantType.TYPE_NIL:
				this.source = 'nil';

				break;

				break;

			case ConstantType.TYPE_STRING:
				this.source = ignoreQuotes ? value : `"${value}"`;

				break;
			default:
				this.source = value.toString();

				break;
		}

		return this.source;
	}
}
