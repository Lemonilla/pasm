/*
	TODO:
		Reads comments as unknown opcodes.
		lineNumber displays 1 line above the actual error
			(lines start at 0, but numbering starts at 1)



*/

function compileScript(){
	var fullText = editor.getValue();
	var byLine = fullText.split("\n");
	var goodCompile = false
	var errorLog = ""
	var flags = {}

	// check argument syntax
	var r = checkArgs(byLine, errorLog, flags)
	errorLog = r.errorLog
	flags = r.flags
	if (errorLog !== "") {
		alert("Compile Aborted.\n\n"+errorLog);
		goodCompile = false;
	}

	// Check all jumps for flag existance

	// Build a flag:number table

	// Check version

	// Build script and flag_number:offset table

	// build .bin file


	

	//console.log(errorLog);

}

function checkArgs(byLine, errorLog, flags){
	for(var lineNumber in byLine){
		var tokens = byLine[lineNumber].split(" ");

		var opcode = -1
		var opcodeParams = ""
		var args = []
		for(var i in tokens){
			if (opcode == -1) {
				// we need to grab the first thingy make sure it's an opcode
				// then get it's number and store it here with all it's information
				for(var n in opcodes){ 
					if (tokens[i] == opcodes[n].Name) {
						opcode = opcodes[n].Value
						opcodeParams = opcodes[n].Parameters
					} 
				}
				if (opcode == -1){
					// check to see if we've hit a flag.
					// if so, then log it and it's location


					// case: Flags
					if (
						(new RegExp("@[a-z|A-Z][a-z|A-Z|0-9|_]*:")).test(tokens[i]) ||
						(new RegExp("[0-9]+:")).test(tokens[i])
						) {
							flags[tokens[i].substring(0,tokens[i].length - 1)] = lineNumber
							opcode = -2; // don't throw an error on this line now.
							continue;
					}


					// case: Comments
					if (tokens[i].indexOf("//") != -1) continue;


					// They fucked up.  write it to the error log
					errorLog += "Unknown opcode \'"+tokens[0].toString()+"\' on line "+lineNumber.toString()+"\n";
					break;
				}
			} else if (tokens[i] == "") {
				continue; 
			} else {
				 // we're starting to deal with parameters
				args.push(tokens[i].replace(",",""))
			}
		}

		// check parameters are correctly alligned for that opcode
		var argumentTypes = opcodeParams.split('');
		var args_pos = 0
		var argt_pos = 0
		var argumentsAreGood = true
		var unknownOpcode = false
		while(true) {
			// End Condition
			if (args_pos >= args.length || argt_pos >= argumentTypes.length){
				if ((args_pos >= args.length && argt_pos >= argumentTypes.length) || unknownOpcode){
					break;
				} else {
					break;
					argumentsAreGood = false;
					console.log("u"+unknownOpcode+" t"+argt_pos+" s"+args_pos)
					errorLog += "Argument length does not match expected value on line "+lineNumber.toString()+"\n";
				}
			}

			if (!argumentsAreGood) break;

			switch(argumentTypes[argt_pos]){
				// push\pop stack
				case 'a':
				case 'A':
				case 'p':
				case 'P':
					args_pos-=1
					break;

				// register
				case 'R':
				case 'r':
					if (!((new RegExp("[R|r]([1-2][0-9][0-9]|[0-9][0-9]|[0-9])")).test(args[args_pos]))) {
						argumentsAreGood = false;
						console.log("Bad register")
						errorLog += "Invalid Argument type on line "+lineNumber.toString()+"\n";
						errorLog += "\tExpected a Register and got \'"+args[args_pos]+"\'\n";
					}
					break;

				// 8 bit number
				case 'b':
				case 'B':
					if (
						!((new RegExp("0x[0-9|A-F|a-f]+")).test(args[args_pos])) &&
						!((new RegExp("[0-9]+")).test(args[args_pos]))
						) {
							argumentsAreGood = false;
							console.log("Bad number")
							errorLog += "Invalid Argument type on line "+lineNumber.toString()+"\n";
							errorLog += "\tExpected a Immediate value and got \'"+args[args_pos]+"\'\n";
					}
					if (parseInt(args[args_pos]) > 0xFF){
						argumentsAreGood = false;
						errorLog += "Invalid Argument type on line "+lineNumber.toString()+"\n";
						errorLog += "\tExpected value smaller than 0xFF\n";
					}
					break;

				// 16 bit number
				case 'w':
				case 'W':
					if (
						!((new RegExp("0x[0-9|A-F|a-f]+")).test(args[args_pos])) &&
						!((new RegExp("[0-9]+")).test(args[args_pos]))
						) {
							argumentsAreGood = false;
							console.log("Bad number")
							errorLog += "Invalid Argument type on line "+lineNumber.toString()+"\n";
							errorLog += "\tExpected a Immediate value and got \'"+args[args_pos]+"\'\n";
					}
					if (parseInt(args[args_pos]) > 0xFFFF){
						argumentsAreGood = false;
						errorLog += "Invalid Argument type on line "+lineNumber.toString()+"\n";
						errorLog += "\tExpected value smaller than 0xFFFF\n";
					}
					break;

				// 32 bit number
				case 'l':
				case 'L':
				case 'i':
				case 'I':
					if (
						!((new RegExp("0x[0-9|A-F|a-f]+")).test(args[args_pos])) &&
						!((new RegExp("[0-9]+")).test(args[args_pos]))
						) {
							argumentsAreGood = false;
							console.log("Bad number")
							errorLog += "Invalid Argument type on line "+lineNumber.toString()+"\n";
							errorLog += "\tExpected a Immediate value and got \'"+args[args_pos]+"\'\n";
					}
					if (parseInt(args[args_pos]) > 0xFFFFFFFF){
						argumentsAreGood = false;
						errorLog += "Invalid Argument type on line "+lineNumber.toString()+"\n";
						errorLog += "\tExpected value smaller than 0xFFFFFFFF\n";
					}
					break;

				// floating Point (32 bits)
				case 'F':
				case 'f':
					if (!((new RegExp("-?[0-9]*[\.[0-9]+]?")).test(args[args_pos]))){
						errorLog += "Invalid Argument type on line "+lineNumber.toString()+"\n";
						errorLog += "\tExpected floating point number.\n"
					}
					break;

					

				// jump list
				// numberOfJumps:Jump1:jump2: etc
				case 'J':
				case 'j':
					var jumps = args[args_pos].split(":")
					if (jumps.length <= 1){
						console.log("Bad jump case")
						errorLog += "Jump case is too short on line "+lineNumber+"\n"
						break;
					}
					var numberOfJumps = parseInt(jumps[0])
					for(var i = 1; i <= numberOfJumps; i++){
						
						
						if (
							(!(new RegExp("@[a-z|A-Z][a-z|A-Z|0-9|_]*")).test(jumps[i])) && 
							!((new RegExp("[0-9]+")).test(jumps[i]))
							){
								// if it is not a jump location in syntax
								// we'll check if the location exists later
								errorLog += "Bad jump location on line "+lineNumber+"\n";
								break;
						}
					}
					if (numberOfJumps+1 != jumps.length){
						errorLog += "Jump total does not match on line "+lineNumber+"\n";
						break;
					}
					break;
				// used with jmp_on and jmp_off
				case 'T':
				case 't':
					errorLog += "jmp_on and jmp_off opcodes are not currently supported"
					break;
				// String
				case 'S':
				case 's':
					var firstChar = args[args_pos].charAt(0)
					var string = args[args_pos]
					while(args[args_pos].indexOf(firstChar) == -1){
						if (args_pos == args.length){
							console.log("Bad string")
							errorLog += "Invalid Argument string on line "+lineNumber.toString()+"\n";
							break;
						}
						args_pos += 1
						string += " "+args[args_pos]
					}
					args_pos+=1
					string +=" "+args[args_pos]
					break;
				case 'U':
				case 'u':
					unknownOpcode = true;
					argt_pos -= 1 ; // don't increment the expected position so we'll keep seeing 'U' until we're done.
					break;

				default:
					console.log(argt_pos);
					errorLog += "An error occured trying to read the opcodes json for opcode "+opcode.toString()+"\n";
					errorLog += "\t Unknown parameter code "+argumentTypes[argt_pos]+"\n";
					break;
			} // end switch
			args_pos += 1;
			argt_pos += 1;
		} // end while

		
	} // end ForEach( line )

	return {"errorLog":errorLog, "flags":flags};
}