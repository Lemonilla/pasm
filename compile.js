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

function pairArgFlag(t){
	flags = []
	for(i=0; i < t.length; i++){
		switch(t[i][0]) {
			case TYPE_FLAG:
				flags.add(t[i]);
				continue
			case TYPE_COMMENT_MULTI:
			case TYPE_COMMENT_SINGLE:
				continue
			case TYPE_ERROR:
				alert("Error, "+PROGRAM_NAME+" did not recognize "+t[i][1]+" at line "+i)
				return null;
			case TYPE_NUMBER_HEX:
				
		}

	}
}





// token looks like : [type, string]
function tokenize(string){
	ret = []
	split = string.split("\n")
	for (i=0; i< split.length; i++){
		s = split[i]
		for (var i = 0; i < CHAR_TO_REPLACE.length; i++) {
			s = s.replace(CHAR_TO_REPLACE[i],"")
		};
		ret.add([getType(s),s])
	}
	return ret;
}

function getType(s){
	if (s.substring(s.length-1,s.length) == ":") return TYPE_FLAG;
	if (s.substring(0,2) == "\*") return TYPE_COMMENT_MULTI;
	if (s.substring(0,2) == "//") return TYPE_COMMENT_SINGLE;
	if (
		(s.substring(0,1) == "R" || s.substring(0,1) == "r") && 
		(parseInt(s.substring(1,s.length)) < 256)) 
			return TYPE_REGISTER;
	if (
		(s.substring(0,2) == "0x") &&
		(parseInt(s.substring(2,s.length)) != NaN ))
			return TYPE_NUMBER_HEX;
	if (parseInt(s) != NaN) return TYPE_NUMBER_DECIMAL;
	if (getOpcodeByName(s) != null) return TYPE_OPCODE;

	return TYPE_ERROR;

}