# Luau Decompiler

Work in progress

# Usage

Node is required to run the decompiler.

To run the decompiler, run the following commands in the root directory:

```bash
npm install
npm start <input-file> <output-dir>
```

The decompiler will output the decompiled Lua code to the output directory, along with the deserialized code.

# Getting Luau Bytecode

To get the bytecode of a Luau file, build the luau-writebytecode binary from the `luau` directory and run the binary with your input and output files.

You may also use bytecode from other sources, as long as it is valid Luau bytecode and compatible with the version of Luau that the decompiler is built for.

To build the binary, run the following commands in the luau directory:

On all platforms:

```bash
mkdir cmake && cd cmake
cmake .. -DCMAKE_BUILD_TYPE=RelWithDebInfo
cmake --build . --target Luau.WriteBytecode.CLI --config RelWithDebInfo
```

On Linux/MacOS:

```bash
make config=release luau-writebytecode
```

Then in the luau directory run the binary with your input and output files run the luau-writebytecode binary.

Usage:

`./luau-writebytecode <input-file> <output-file>`

Example:

```bash
./luau-writebytecode test.lua testbytecode.luauc
```

The output file will contain the bytecode of the input file.
