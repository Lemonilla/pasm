/*
	TODO:

*/

CHAR_TO_REPLACE = [" ","\t"," ",","]

TYPE_ERROR = -1;
TYPE_FLAG = 0;
TYPE_OPCODE = 1;
TYPE_REGISTER = 2;
TYPE_NUMBER_DECIMAL = 3;
TYPE_NUMBER_HEX = 4;
TYPE_COMMENT_SINGLE = 5;
TYPE_COMMENT_MULTI = 6;

function compileScript(){
	// tokenize (figure out what it's suppose to be)
	tokens = tokenize(editor.getValue())
	// pair arguments with opcodes (& check to make sure they match)
	// number flags
	// generate opcodes bit stream
	// generate flag table
	// generate file header
}
