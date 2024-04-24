cmake_minimum_required(VERSION 3.12)
project(LuauDecompiler)

# Compiler flags
set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -Wall")
include_directories(../luau/VM/include ../luau/Compiler/include)
link_directories(../luau/build/release)

# Source files
set(SRC main.cpp)

# Output binary
set(BIN generator)

# Rule for building the binary
add_executable(${BIN} ${SRC})
target_link_libraries(${BIN} luauvm luaucompiler luauast isocline)
