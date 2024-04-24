XX = g++

# Compiler flags
CXXFLAGS = -Wall -I../luau/VM/include -I../luau/Compiler/include -L../luau/build/release -lluauvm -lluaucompiler -lluauast -lisocline

# Source files + compile luau
SRC = main.cpp

# Output binary
BIN = generator

# Directory
DIR = .

# Rule for building the binary
$(BIN): $(addprefix $(DIR)/, $(SRC))
	$(CXX) $(CXXFLAGS) -o $(BIN) $(addprefix $(DIR)/, $(SRC))

# Rule for cleaning up the binary
clean:
	rm -f $(BIN)