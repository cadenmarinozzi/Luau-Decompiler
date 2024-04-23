export enum Opcodes {
	// NOP: noop
	LOP_NOP,

	// BREAK: debugger break
	LOP_BREAK,

	// LOADNIL: sets register to nil
	// A: target register
	LOP_LOADNIL,

	// LOADB: sets register to boolean and jumps to a given short offset (used to compile comparison results into a boolean)
	// A: target register
	// B: value (0/1)
	// C: jump offset
	LOP_LOADB,

	// LOADN: sets register to a number literal
	// A: target register
	// D: value (-32768..32767)
	LOP_LOADN,

	// LOADK: sets register to an entry from the constant table from the proto (number/vector/string)
	// A: target register
	// D: constant table index (0..32767)
	LOP_LOADK,

	// MOVE: move (copy) value from one register to another
	// A: target register
	// B: source register
	LOP_MOVE,

	// GETGLOBAL: load value from global table using constant string as a key
	// A: target register
	// C: predicted slot index (based on hash)
	// AUX: constant table index
	LOP_GETGLOBAL,

	// SETGLOBAL: set value in global table using constant string as a key
	// A: source register
	// C: predicted slot index (based on hash)
	// AUX: constant table index
	LOP_SETGLOBAL,

	// GETUPVAL: load upvalue from the upvalue table for the current function
	// A: target register
	// B: upvalue index
	LOP_GETUPVAL,

	// SETUPVAL: store value into the upvalue table for the current function
	// A: target register
	// B: upvalue index
	LOP_SETUPVAL,

	// CLOSEUPVALS: close (migrate to heap) all upvalues that were captured for registers >= target
	// A: target register
	LOP_CLOSEUPVALS,

	// GETIMPORT: load imported global table global from the constant table
	// A: target register
	// D: constant table index (0..32767); we assume that imports are loaded into the constant table
	// AUX: 3 10-bit indices of constant strings that, combined, constitute an import path; length of the path is set by the top 2 bits (1,2,3)
	LOP_GETIMPORT,

	// GETTABLE: load value from table into target register using key from register
	// A: target register
	// B: table register
	// C: index register
	LOP_GETTABLE,

	// SETTABLE: store source register into table using key from register
	// A: source register
	// B: table register
	// C: index register
	LOP_SETTABLE,

	// GETTABLEKS: load value from table into target register using constant string as a key
	// A: target register
	// B: table register
	// C: predicted slot index (based on hash)
	// AUX: constant table index
	LOP_GETTABLEKS,

	// SETTABLEKS: store source register into table using constant string as a key
	// A: source register
	// B: table register
	// C: predicted slot index (based on hash)
	// AUX: constant table index
	LOP_SETTABLEKS,

	// GETTABLEN: load value from table into target register using small integer index as a key
	// A: target register
	// B: table register
	// C: index-1 (index is 1..256)
	LOP_GETTABLEN,

	// SETTABLEN: store source register into table using small integer index as a key
	// A: source register
	// B: table register
	// C: index-1 (index is 1..256)
	LOP_SETTABLEN,

	// NEWCLOSURE: create closure from a child proto; followed by a CAPTURE instruction for each upvalue
	// A: target register
	// D: child proto index (0..32767)
	LOP_NEWCLOSURE,

	// NAMECALL: prepare to call specified method by name by loading function from source register using constant index into target register and copying source register into target register + 1
	// A: target register
	// B: source register
	// C: predicted slot index (based on hash)
	// AUX: constant table index
	// Note that this instruction must be followed directly by CALL; it prepares the arguments
	// This instruction is roughly equivalent to GETTABLEKS + MOVE pair, but we need a special instruction to support custom __namecall metamethod
	LOP_NAMECALL,

	// CALL: call specified function
	// A: register where the function object lives, followed by arguments; results are placed starting from the same register
	// B: argument count + 1, or 0 to preserve all arguments up to top (MULTRET)
	// C: result count + 1, or 0 to preserve all values and adjust top (MULTRET)
	LOP_CALL,

	// RETURN: returns specified values from the function
	// A: register where the returned values start
	// B: number of returned values + 1, or 0 to return all values up to top (MULTRET)
	LOP_RETURN,

	// JUMP: jumps to target offset
	// D: jump offset (-32768..32767; 0 means "next instruction" aka "don't jump")
	LOP_JUMP,

	// JUMPBACK: jumps to target offset; this is equivalent to JUMP but is used as a safepoint to be able to interrupt while/repeat loops
	// D: jump offset (-32768..32767; 0 means "next instruction" aka "don't jump")
	LOP_JUMPBACK,

	// JUMPIF: jumps to target offset if register is not nil/false
	// A: source register
	// D: jump offset (-32768..32767; 0 means "next instruction" aka "don't jump")
	LOP_JUMPIF,

	// JUMPIFNOT: jumps to target offset if register is nil/false
	// A: source register
	// D: jump offset (-32768..32767; 0 means "next instruction" aka "don't jump")
	LOP_JUMPIFNOT,

	// JUMPIFEQ, JUMPIFLE, JUMPIFLT, JUMPIFNOTEQ, JUMPIFNOTLE, JUMPIFNOTLT: jumps to target offset if the comparison is true (or false, for NOT variants)
	// A: source register 1
	// D: jump offset (-32768..32767; 1 means "next instruction" aka "don't jump")
	// AUX: source register 2
	LOP_JUMPIFEQ,
	LOP_JUMPIFLE,
	LOP_JUMPIFLT,
	LOP_JUMPIFNOTEQ,
	LOP_JUMPIFNOTLE,
	LOP_JUMPIFNOTLT,

	// ADD, SUB, MUL, DIV, MOD, POW: compute arithmetic operation between two source registers and put the result into target register
	// A: target register
	// B: source register 1
	// C: source register 2
	LOP_ADD,
	LOP_SUB,
	LOP_MUL,
	LOP_DIV,
	LOP_MOD,
	LOP_POW,

	// ADDK, SUBK, MULK, DIVK, MODK, POWK: compute arithmetic operation between the source register and a constant and put the result into target register
	// A: target register
	// B: source register
	// C: constant table index (0..255); must refer to a number
	LOP_ADDK,
	LOP_SUBK,
	LOP_MULK,
	LOP_DIVK,
	LOP_MODK,
	LOP_POWK,

	// AND, OR: perform `and` or `or` operation (selecting first or second register based on whether the first one is truthy) and put the result into target register
	// A: target register
	// B: source register 1
	// C: source register 2
	LOP_AND,
	LOP_OR,

	// ANDK, ORK: perform `and` or `or` operation (selecting source register or constant based on whether the source register is truthy) and put the result into target register
	// A: target register
	// B: source register
	// C: constant table index (0..255)
	LOP_ANDK,
	LOP_ORK,

	// CONCAT: concatenate all strings between B and C (inclusive) and put the result into A
	// A: target register
	// B: source register start
	// C: source register end
	LOP_CONCAT,

	// NOT, MINUS, LENGTH: compute unary operation for source register and put the result into target register
	// A: target register
	// B: source register
	LOP_NOT,
	LOP_MINUS,
	LOP_LENGTH,

	// NEWTABLE: create table in target register
	// A: target register
	// B: table size, stored as 0 for v=0 and ceil(log2(v))+1 for v!=0
	// AUX: array size
	LOP_NEWTABLE,

	// DUPTABLE: duplicate table using the constant table template to target register
	// A: target register
	// D: constant table index (0..32767)
	LOP_DUPTABLE,

	// SETLIST: set a list of values to table in target register
	// A: target register
	// B: source register start
	// C: value count + 1, or 0 to use all values up to top (MULTRET)
	// AUX: table index to start from
	LOP_SETLIST,

	// FORNPREP: prepare a numeric for loop, jump over the loop if first iteration doesn't need to run
	// A: target register; numeric for loops assume a register layout [limit, step, index, variable]
	// D: jump offset (-32768..32767)
	// limit/step are immutable, index isn't visible to user code since it's copied into variable
	LOP_FORNPREP,

	// FORNLOOP: adjust loop variables for one iteration, jump back to the loop header if loop needs to continue
	// A: target register; see FORNPREP for register layout
	// D: jump offset (-32768..32767)
	LOP_FORNLOOP,

	// FORGLOOP: adjust loop variables for one iteration of a generic for loop, jump back to the loop header if loop needs to continue
	// A: target register; generic for loops assume a register layout [generator, state, index, variables...]
	// D: jump offset (-32768..32767)
	// AUX: variable count (1..255) in the low 8 bits, high bit indicates whether to use ipairs-style traversal in the fast path
	// loop variables are adjusted by calling generator(state, index) and expecting it to return a tuple that's copied to the user variables
	// the first variable is then copied into index; generator/state are immutable, index isn't visible to user code
	LOP_FORGLOOP,

	// FORGPREP_INEXT: prepare FORGLOOP with 2 output variables (no AUX encoding), assuming generator is luaB_inext, and jump to FORGLOOP
	// A: target register (see FORGLOOP for register layout)
	LOP_FORGPREP_INEXT,

	// removed in v3
	LOP_DEP_FORGLOOP_INEXT,

	// FORGPREP_NEXT: prepare FORGLOOP with 2 output variables (no AUX encoding), assuming generator is luaB_next, and jump to FORGLOOP
	// A: target register (see FORGLOOP for register layout)
	LOP_FORGPREP_NEXT,

	// NATIVECALL: start executing new function in native code
	// this is a pseudo-instruction that is never emitted by bytecode compiler, but can be constructed at runtime to accelerate native code dispatch
	LOP_NATIVECALL,

	// GETVARARGS: copy variables into the target register from vararg storage for current function
	// A: target register
	// B: variable count + 1, or 0 to copy all variables and adjust top (MULTRET)
	LOP_GETVARARGS,

	// DUPCLOSURE: create closure from a pre-created function object (reusing it unless environments diverge)
	// A: target register
	// D: constant table index (0..32767)
	LOP_DUPCLOSURE,

	// PREPVARARGS: prepare stack for variadic functions so that GETVARARGS works correctly
	// A: number of fixed arguments
	LOP_PREPVARARGS,

	// LOADKX: sets register to an entry from the constant table from the proto (number/string)
	// A: target register
	// AUX: constant table index
	LOP_LOADKX,

	// JUMPX: jumps to the target offset; like JUMPBACK, supports interruption
	// E: jump offset (-2^23..2^23; 0 means "next instruction" aka "don't jump")
	LOP_JUMPX,

	// FASTCALL: perform a fast call of a built-in function
	// A: builtin function id (see LuauBuiltinFunction)
	// C: jump offset to get to following CALL
	// FASTCALL is followed by one of (GETIMPORT, MOVE, GETUPVAL) instructions and by CALL instruction
	// This is necessary so that if FASTCALL can't perform the call inline, it can continue normal execution
	// If FASTCALL *can* perform the call, it jumps over the instructions *and* over the next CALL
	// Note that FASTCALL will read the actual call arguments, such as argument/result registers and counts, from the CALL instruction
	LOP_FASTCALL,

	// COVERAGE: update coverage information stored in the instruction
	// E: hit count for the instruction (0..2^23-1)
	// The hit count is incremented by VM every time the instruction is executed, and saturates at 2^23-1
	LOP_COVERAGE,

	// CAPTURE: capture a local or an upvalue as an upvalue into a newly created closure; only valid after NEWCLOSURE
	// A: capture type, see LuauCaptureType
	// B: source register (for VAL/REF) or upvalue index (for UPVAL/UPREF)
	LOP_CAPTURE,

	// SUBRK, DIVRK: compute arithmetic operation between the constant and a source register and put the result into target register
	// A: target register
	// B: source register
	// C: constant table index (0..255); must refer to a number
	LOP_SUBRK,
	LOP_DIVRK,

	// FASTCALL1: perform a fast call of a built-in function using 1 register argument
	// A: builtin function id (see LuauBuiltinFunction)
	// B: source argument register
	// C: jump offset to get to following CALL
	LOP_FASTCALL1,

	// FASTCALL2: perform a fast call of a built-in function using 2 register arguments
	// A: builtin function id (see LuauBuiltinFunction)
	// B: source argument register
	// C: jump offset to get to following CALL
	// AUX: source register 2 in least-significant byte
	LOP_FASTCALL2,

	// FASTCALL2K: perform a fast call of a built-in function using 1 register argument and 1 constant argument
	// A: builtin function id (see LuauBuiltinFunction)
	// B: source argument register
	// C: jump offset to get to following CALL
	// AUX: constant index
	LOP_FASTCALL2K,

	// FORGPREP: prepare loop variables for a generic for loop, jump to the loop backedge unconditionally
	// A: target register; generic for loops assume a register layout [generator, state, index, variables...]
	// D: jump offset (-32768..32767)
	LOP_FORGPREP,

	// JUMPXEQKNIL, JUMPXEQKB: jumps to target offset if the comparison with constant is true (or false, see AUX)
	// A: source register 1
	// D: jump offset (-32768..32767; 1 means "next instruction" aka "don't jump")
	// AUX: constant value (for boolean) in low bit, NOT flag (that flips comparison result) in high bit
	LOP_JUMPXEQKNIL,
	LOP_JUMPXEQKB,

	// JUMPXEQKN, JUMPXEQKS: jumps to target offset if the comparison with constant is true (or false, see AUX)
	// A: source register 1
	// D: jump offset (-32768..32767; 1 means "next instruction" aka "don't jump")
	// AUX: constant table index in low 24 bits, NOT flag (that flips comparison result) in high bit
	LOP_JUMPXEQKN,
	LOP_JUMPXEQKS,

	// IDIV: compute floor division between two source registers and put the result into target register
	// A: target register
	// B: source register 1
	// C: source register 2
	LOP_IDIV,

	// IDIVK compute floor division between the source register and a constant and put the result into target register
	// A: target register
	// B: source register
	// C: constant table index (0..255)
	LOP_IDIVK,

	// Enum entry for number of opcodes, not a valid opcode by itself!
	LOP__COUNT,
}

export interface OpProperties {
	mode: 'none' | 'abc' | 'ad' | 'e';
	hasAux: boolean;
}

export function getOpProperties(Opcode: any): OpProperties {
	switch (Opcode) {
		case Opcodes.LOP_NOP:
			return { mode: 'none', hasAux: false };
		case Opcodes.LOP_BREAK:
			return { mode: 'none', hasAux: false };
		case Opcodes.LOP_LOADN:
			return { mode: 'ad', hasAux: false };
		case Opcodes.LOP_LOADK:
			return { mode: 'ad', hasAux: false };
		case Opcodes.LOP_GETGLOBAL:
			return { mode: 'abc', hasAux: true };
		case Opcodes.LOP_SETGLOBAL:
			return { mode: 'abc', hasAux: true };
		case Opcodes.LOP_GETIMPORT:
			return { mode: 'ad', hasAux: true };
		case Opcodes.LOP_GETTABLEKS:
			return { mode: 'abc', hasAux: true };
		case Opcodes.LOP_SETTABLEKS:
			return { mode: 'abc', hasAux: true };
		case Opcodes.LOP_NEWCLOSURE:
			return { mode: 'ad', hasAux: false };
		case Opcodes.LOP_NAMECALL:
			return { mode: 'abc', hasAux: true };
		case Opcodes.LOP_JUMP:
			return { mode: 'ad', hasAux: false };
		case Opcodes.LOP_JUMPBACK:
			return { mode: 'ad', hasAux: false };
		case Opcodes.LOP_JUMPIF:
			return { mode: 'ad', hasAux: false };
		case Opcodes.LOP_JUMPIFNOT:
			return { mode: 'ad', hasAux: false };
		case Opcodes.LOP_JUMPIFEQ:
			return { mode: 'ad', hasAux: true };
		case Opcodes.LOP_JUMPIFLE:
			return { mode: 'ad', hasAux: true };
		case Opcodes.LOP_JUMPIFLT:
			return { mode: 'ad', hasAux: true };
		case Opcodes.LOP_JUMPIFNOTEQ:
			return { mode: 'ad', hasAux: true };
		case Opcodes.LOP_JUMPIFNOTLE:
			return { mode: 'ad', hasAux: true };
		case Opcodes.LOP_JUMPIFNOTLT:
			return { mode: 'ad', hasAux: true };
		case Opcodes.LOP_NEWTABLE:
			return { mode: 'abc', hasAux: true };
		case Opcodes.LOP_DUPTABLE:
			return { mode: 'ad', hasAux: false };
		case Opcodes.LOP_SETLIST:
			return { mode: 'abc', hasAux: true };
		case Opcodes.LOP_FORNPREP:
			return { mode: 'ad', hasAux: false };
		case Opcodes.LOP_FORNLOOP:
			return { mode: 'ad', hasAux: false };
		case Opcodes.LOP_FORGLOOP:
			return { mode: 'ad', hasAux: true };
		case Opcodes.LOP_FORGPREP_INEXT:
			return { mode: 'ad', hasAux: false };
		case Opcodes.LOP_DEP_FORGLOOP_INEXT:
			return { mode: 'ad', hasAux: false };
		case Opcodes.LOP_FORGPREP_NEXT:
			return { mode: 'ad', hasAux: false };
		case Opcodes.LOP_DUPCLOSURE:
			return { mode: 'ad', hasAux: false };
		case Opcodes.LOP_LOADKX:
			return { mode: 'abc', hasAux: true };
		case Opcodes.LOP_JUMPX:
			return { mode: 'e', hasAux: false };
		case Opcodes.LOP_COVERAGE:
			return { mode: 'e', hasAux: false };
		case Opcodes.LOP_FASTCALL2:
			return { mode: 'abc', hasAux: true };
		case Opcodes.LOP_FASTCALL2K:
			return { mode: 'abc', hasAux: true };
		case Opcodes.LOP_FORGPREP:
			return { mode: 'ad', hasAux: false };
		case Opcodes.LOP_JUMPXEQKNIL:
			return { mode: 'ad', hasAux: true };
		case Opcodes.LOP_JUMPXEQKB:
			return { mode: 'ad', hasAux: true };
		case Opcodes.LOP_JUMPXEQKN:
			return { mode: 'ad', hasAux: true };
		case Opcodes.LOP_JUMPXEQKS:
			return { mode: 'ad', hasAux: true };

		default:
			return { mode: 'abc', hasAux: false };
	}
}
