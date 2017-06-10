/*
	TODO:
		Reads comments as unknown opcodes.
		lineNumber displays 1 line above the actual error
			(lines start at 0, but numbering starts at 1)



*/

function compileScript(){
	var fullText = editor.getValue();
	var goodCompile = false
	var errorLog = ""


	// tokenize code
	var tokens = tokenize(fullText)

	// check argument syntax

	// Check all jumps for flag existance

	// Build a flag:number table

	// Check version

	// Build script and flag_number:offset table

	// build .bin file
}

function tokenize(fullText){
	var tokens = [];
	// tokens = { opcode[] }
	// opcode = { Opcode:opcodeJson, Arguments:[args], Flags:[""] }
	// args = [string:"", type:'']

	var byLine = fullText.split("\n")
	var flags = []

	for(var i in byLine){
		var line = byLine[i].trim();
		var endOfOpcode = line.indexOf(" ")
		if (endOfOpcode == -1){
			// we are dealing with a flag
			// or a zero argument opcode
			if(line.substring(line.length-1, line.length) == ":"){
				console.log("flag")
				flags.push(line.substring(0,line.length-1))
			} else {
				console.log("opcode")
				tokens.push({
					"Opcode":getOpcodeByName(line),
					"Arguments":[],
					"Flags":flags
				})
				// empty flags for next opcode
				flags = []
				
			}

		} else {
			// multi\mono argument opcode
			var opcode = line.substring(0,endOfOpcode);
			line = line.substring(endOfOpcode,line.length)
			
			if(line.indexOf(",") == -1 && line.indexOf("\"") == -1){
				// mono argument opcode that doesn't take a string
				console.log("mono opcode")
				tokens.push({
					"Opcode":getOpcodeByName(opcode),
					"Arguments":[[line,getArgumentType(line)]],
					"Flags":flags
				})
				// empty flags for next opcode
				flags = []

			}


		}
		console.log(tokens)

	}
}

// figurs out wtf our string is.
function getArgumentType(string){

	var register = new RegExp("[R|r]([1-2][0-9][0-9]|[0-9][0-9]|[0-9])")
	var number1 = new RegExp("0x[0-9|A-F|a-f]+")
	var number2 = new RegExp("[0-9]+")
	var floating = new RegExp("-?[0-9]*[\.[0-9]+]?")
	var string1 = new RegExp("\'(?:[^\\]|\\.)*?(?:\'|$)")  // these two lines are erroring
	var string2 = new RegExp("\"(?:[^\\]|\\.)*?(?:\"|$)")

	if (register.test(string)){
		return 'R'
	}
	if (number1.test(string) || number2.test(string)){
		return 'N'
	}
	if (floating.test(string)){
		return 'F'
	}
	if (string1.test(string) || string2.test(string)){
		return 'S'
	}
	
	return 'U'
}