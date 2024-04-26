# Luau Decompiler

Work in progress, taking PRs.

# Installation

The decompiler requires Node.js to run.

To install Node.js, visit the [Node.js website](https://nodejs.org/).

To install the decompiler, clone the repository:

```bash
git clone https://github.com/cadenmarinozzi/Luau-Decompiler
```

Then navigate to the root directory and install the dependencies:

```bash
cd Luau-Decompiler
npm install
```

# Usage

Usage: `npm start decompiler.js <input-file> <output-directory>`

The decompiler will output the decompiled Lua code to the output directory, along with the deserialized code.

# Getting Luau Bytecode

To get the bytecode of a Luau file, you must build the generator binary.

You may also use bytecode from other sources, as long as it is valid Luau bytecode and compatible with the version of Luau that the decompiler is built for.

To build the generator, run the following commands in the `generator` directory:

First, download the Luau source code from the Roblox repository:

```bash
git clone https://https://github.com/luau-lang/luau
```

Then build the Luau compiler:

On all platforms:

```bash
mkdir cmake && cd cmake
cmake .. -DCMAKE_BUILD_TYPE=RelWithDebInfo
cmake --build . --target Luau.Repl.CLI --config RelWithDebInfo
```

On Linux/MacOS:

```bash
make config=release luau
```

Then build the generator:

On all platforms:

```bash
cmake -B build -S .
```

On Linux/MacOS:

```bash
make
```

Usage:

`./generator <input-file> <output-file>`

Example:

```bash
./generator file.luau bytecode.luauc
```

The output file will contain the bytecode of the input file.
