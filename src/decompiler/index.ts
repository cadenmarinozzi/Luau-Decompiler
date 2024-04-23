import Function from '../deserializer/Function';
import Instruction from '../deserializer/Instruction';
import Program from '../deserializer/Program';
import { ConstantType } from '../enums/constants';
import { Opcodes } from '../enums/opcodes';
import { Assignment } from './expressions/Assignment';
import { Block } from './expressions/Block';
import { Break } from './expressions/Break';
import { Call } from './expressions/Call';
import { End } from './expressions/End';
import { FunctionDefinition } from './expressions/FunctionDefinition';
import { IfThen } from './statements/IfThen';
import { Add } from './expressions/Inline/Add';
import { Constant } from './expressions/Inline/Constant';
import { Eq } from './expressions/Inline/Eq';
import { Sub } from './expressions/Inline/Sub';
import { Return } from './expressions/Return';
import { Neq } from './expressions/Inline/Neq';
import { Le } from './expressions/Inline/Le';
import { Not } from './expressions/Inline/Not';

function buildBlock(
	func: Function,
	program: Program,
	startPC: number = 0,
	endPC: number = func.instructions.length
) {
	const block = new Block();

	let args: string[] = [];

	let pc = startPC;

	while (pc < endPC) {
		const instruction: Instruction = func.instructions[pc];

		pc++;

		const aux = func.instructions[pc]?.opcode;

		if (instruction.properties.hasAux) {
			pc++;
		}

		const { a, b, c, d, opcode } = instruction;
		let top;

		switch (opcode) {
			case Opcodes.LOP_NOP: {
				break;
			}

			case Opcodes.LOP_LOADNIL: {
				const assignment = new Assignment(`R${a}`, 'nil');
				block.statements.push(assignment);

				break;
			}

			case Opcodes.LOP_SETGLOBAL: {
				const constant = func.constants[aux];
				const str = program.stringTable.getFromId(constant.value);

				const assignment = new Assignment(str, `R${a}`);
				block.statements.push(assignment);

				break;
			}

			case Opcodes.LOP_DUPCLOSURE: {
				const constant = func.constants[d];
				const globalFunc = program.functions[constant.value];

				const blo = buildBlock(globalFunc, program);
				const funcDef = new FunctionDefinition(`R${a}`, []);

				const funcBlock = new Block();
				funcBlock.statements.push(funcDef);
				funcBlock.statements.push(blo.block);
				funcBlock.statements.push(new End());

				block.statements.push(funcBlock);

				break;
			}

			case Opcodes.LOP_GETIMPORT: {
				const src = aux & 0xffffff;

				const brco = src >> 30;
				let shift = 20;
				const ids = [];

				if (brco === 0) {
					break;
				}

				for (let i = 0; i < brco; i++) {
					ids.push((src >> shift) & 0x3ff);

					shift -= 10;
				}

				const path = ids
					.map((id) => program.stringTable.getFromId(id))
					.join('.');

				const assignment = new Assignment(`R${a}`, path);
				block.statements.push(assignment);

				break;
			}

			case Opcodes.LOP_PREPVARARGS: {
				args.push('...');

				break;
			}

			case Opcodes.LOP_LOADK: {
				const constant = func.constants[d];
				const constVal = program.stringTable.getFromId(constant.value);

				const assignment = new Assignment(
					`R${a}`,
					new Constant(constVal, constant.type).build()
				);
				block.statements.push(assignment);

				break;
			}

			case Opcodes.LOP_RETURN: {
				const returns: string[] = [];

				for (let j = a; j < a + b - 1; j++) {
					returns.push(`R${j}`);
				}

				const ret = new Return(returns);
				block.statements.push(ret);

				break;
			}

			case Opcodes.LOP_LOADN: {
				const assignment = new Assignment(`R${a}`, d.toString());

				block.statements.push(assignment);

				break;
			}

			case Opcodes.LOP_BREAK: {
				const breakExpr = new Break();
				block.statements.push(breakExpr);

				break;
			}

			case Opcodes.LOP_GETGLOBAL: {
				const constant = func.constants[aux];
				let constVal = constant.value;

				if (constant.type === ConstantType.TYPE_STRING) {
					constVal = program.stringTable.getFromId(constVal);
				}

				const assignment = new Assignment(
					`R${a}`,
					new Constant(constVal, constant.type, true).build()
				);
				block.statements.push(assignment);

				break;
			}

			case Opcodes.LOP_SUBK: {
				const constant = func.constants[c];
				const constValue = constant.value;

				const assignment = new Assignment(
					`R${a}`,
					new Sub(`R${b}`, constValue).build()
				);
				block.statements.push(assignment);

				break;
			}

			case Opcodes.LOP_ADD: {
				const assignment = new Assignment(
					`R${a}`,
					new Add(`R${b}`, `R${c}`).build()
				);
				block.statements.push(assignment);

				break;
			}

			case Opcodes.LOP_CALL: {
				let args = [];

				const nArgs = b > 0 ? b : (top || 1) - a + 1;

				for (let j = a + 1; j < a + nArgs; j++) {
					args.push(`R${j}`);
				}

				const callStatement = new Call(`R${a}`, args);

				if (c - 1 !== 0) {
					const assignment = new Assignment(
						`R${a}`,
						callStatement.build(0)
					);
					block.statements.push(assignment);
				} else {
					block.statements.push(callStatement);
				}

				break;
			}

			case Opcodes.LOP_JUMPIFNOTLE:
			case Opcodes.LOP_JUMPXEQKN: {
				if (d === 1) {
					// Dont jump
				} else {
					const index = aux & 0xffffff;
					const constant = func.constants[index];

					const notFlag = aux >> 31 !== 0;

					const conditionFlag = notFlag
						? Neq
						: opcode === Opcodes.LOP_JUMPXEQKN
						? Eq
						: opcode === Opcodes.LOP_JUMPIFNOTLE
						? Le
						: Eq;

					const isNot = opcode === Opcodes.LOP_JUMPIFNOTLE;

					const conditionExpr = new conditionFlag(
						`R${a}`,
						new Constant(constant.value, constant.type).build()
					);

					const condition = isNot
						? new Not(conditionExpr.build())
						: conditionExpr;

					const ifStatement = new IfThen(condition);
					block.statements.push(ifStatement);

					const hasAux = instruction.properties.hasAux;

					if (hasAux) {
						pc--;
					}

					const auxOffset = hasAux ? 1 : 0;

					const low = pc + auxOffset;
					const high = (pc += d - 1);

					block.statements.push(
						buildBlock(func, program, low, high + 1).block
					);
					block.statements.push(new End());

					if (hasAux) pc++;
				}

				break;
			}

			default: {
				console.error(`Unsupported opcode: ${opcode}`);
			}
		}
	}

	return { block, args };
}

export default function decompile(program: Program): string {
	let decompiled = '';

	for (let i = 0; i < program.functions.length; i++) {
		const func = program.functions[i];
		const { block, args } = buildBlock(func, program);

		if (i === program.mainFunction) {
			decompiled += block.build(0);
		} else {
			const outerBlock = new Block();

			let name = `R${i}`;

			if (func.debugName) {
				name = program.stringTable.getFromId(func.debugName);
			}

			const defArgs = new Array(func.nParams)
				.fill(0)
				.map((v, i) => `R${i}`)
				.concat(args);
			const blockFunc = new FunctionDefinition(name, defArgs);

			outerBlock.statements.push(blockFunc);
			outerBlock.statements.push(block);
			outerBlock.statements.push(new End());

			decompiled += outerBlock.build(0);
		}
	}

	return decompiled;
}
