#include "../luau/Compiler/include/luacode.h"
#include <cstring>
#include <stdio.h>
#include <iostream>

int main(int argc, char** argv) {
    if (argc < 3) {
        printf("Usage: %s <source file> <out_file>\n", argv[0]);

        return 1;
    }

    const char* sourceFile = argv[1];
    const char* outFile = argv[2];

    FILE* file = fopen(sourceFile, "rb");

    if (!file) {
        printf("Failed to open file: %s\n", sourceFile);

        return 1;
    }

    fseek(file, 0, SEEK_END);

    size_t fileSize = ftell(file);
    char* source = new char[fileSize + 1];

    size_t bytecodeSize = 0;
    char* bytecode = luau_compile(source, strlen(source), NULL, &bytecodeSize);
    
    if (bytecode) {
        FILE* out = fopen(outFile, "wb");

        if (!out) {
            printf("Failed to open output file\n");

            return 1;
        }

        fwrite(bytecode, 1, bytecodeSize, out);
        fclose(out);
    }

    return 0;
}