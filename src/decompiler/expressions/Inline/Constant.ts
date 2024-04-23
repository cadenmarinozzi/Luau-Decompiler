import { ConstantType } from '../../../enums/constants';

export class Constant {
	source: string = '';

	value: any;
	type: ConstantType;

	ignoreQuotes: boolean | undefined;

	constructor(value: any, type: ConstantType, ignoreQuotes?: boolean) {
		this.value = value;
		this.type = type;
		this.ignoreQuotes = ignoreQuotes;
	}

	build() {
		switch (this.type) {
			case ConstantType.TYPE_NIL:
				this.source = 'nil';

				break;

			case ConstantType.TYPE_NUMBER:
				this.source = this.value;

				break;

			case ConstantType.TYPE_BOOLEAN:
				this.source = this.value ? 'true' : 'false';

				break;

			case ConstantType.TYPE_NUMBER:
				this.source = this.value.toString();

				break;

			case ConstantType.TYPE_STRING:
				if (this.ignoreQuotes) {
					this.source = this.value;
				} else {
					this.source = `"${this.value}"`;
				}

				break;

			case ConstantType.TYPE_TABLE:
				this.source = this.value.toString();

				break;

			default:
				this.source = this.value.toString();

				break;
		}

		return this.source;
	}
}
