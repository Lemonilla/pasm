function tokenize(string){

    // that way we don't care about argument seperators
    string = string.replace(","," ");
    
    TypeENUM = {
        "Comment-single":0,
        "Comment-multi":1,
        "Opcode":2,
        "Number-hex":3,
        "Number-dec":4,
        "Number-oct":5,
        "Number-bin":6,
        "Flag-point":7,
        "Register":8,
        "Array":9,
        "String":10,
        "Flag-jmp":11
    }

    data = ""
    tokens = []
    token_type = null
    lookahead = null
    line = 1
    // tokens look like this: [TypeENUM,data,]
    for(var index = 0; index < string.length; index++){

        if (string.charAt(index) === '\n') {
            line++
        }

        if (lookahead === null){ // starting a new token
            if ( getOpcodeByName(string.substring(index, string.indexOf(' ',index))) !== null)  {
                // the next token is an opcode
                newindex = string.indexOf(' ',index)
                data = getOpcodeByName(string.substring(index, newindex))
                index = newindex
                tokens.push([TypeENUM["Opcode"],data])
                data = ""
            } else {
                // non-opcode token
                switch(string.charAt(index).toUpperCase()){

                    case '/': // Comment // or /*
                        if (string.charAt(index+1) === '/'){
                            token_type = TypeENUM["Comment-single"]
                            lookahead = "\n"
                            break;
                        } else if (string.charAt(index+1) === '*'){
                            token_type = TypeENUM["Comment-multi"]
                            lookahead = '*'
                        } else {
                            // Error, only single /
                            alert("Error at line "+line+": Ill-formed comment.")
                            return null
                        }
                        break;

                    case '0': //numbers /0.[0-F] /
                        if (string.charAt(index+1) === 'x'){
                            token_type = TypeENUM["Number-hex"]
                            index++
                        } else if (string.charAt(index+1) === 'b') {
                            token_type = TypeENUM["Number-bin"]
                            index++
                        } else if (string.charAt(index+1) === 'o') {
                            token_type = TypeENUM["Number-oct"]
                            index++
                        } else {
                            token_type = TypeENUM["Number-dec"]
                            index--
                        }
                        lookahead = ' '
                        break;

                    case 'F':
                        // looking for '/Fn.*:/' at the start of a line
                        if (string.charAt(index+1).toLowerCase() === 'n') { 
                            if (string.charAt(index-1) === '\n') {
                                // Flag-start
                                token_type = TypeENUM["Flag-point"]
                                lookahead = ':'
                                index++
                            } else {
                                // Flag-jmp
                                token_type = TypeENUM["Flag-jmp"]
                                lookahead = ' '
                                index++
                            }
                        } else {
                            alert("Error at line "+line+": Ill-formed flag.")
                            return null
                        }
                        break;

                    case 'R':
                        // register, looking for space
                        lookahead = ' '
                        token_type = TypeENUM["Register"]
                        break;

                    case '[': // array. used for switch jumps and w/n
                        lookahead = ']'
                        token_type = TypeENUM["Array"]
                        break;

                    case '\'': // string case 1
                        lookahead = '\''
                        token_type = TypeENUM["String"]
                        break;
                    case '\"': // string case 2
                        lookahead = '\"'
                        token_type = TypeENUM["String"]
                        break;  
                }// end switch
            } // end token finder

        } else {
            // we already have a token_type defined and we're parsing data
            if (string.charAt(index) === lookahead) {
                switch(token_type){

                    case TypeENUM["Comment-single"]:
                        data = ""
                        token_type = null
                        lookahead = null
                        break;
                    case TypeENUM["Comment-multi"]:
                        if (string.charAt(index+1) === '/') {
                            // end our comment
                            data = ""
                            lookahead = null
                            token_type = null
                            index++
                        }
                        break;
                    case TypeENUM["Opcode"]:
                        tokens.push([token_type,getOpcodeByName(data)])
                        data = ""
                        token_type = null
                        lookahead = null
                        break;
                    case TypeENUM["Number-hex"]:
                        tokens.push([token_type,parseInt(data,16)])
                        data = ""
                        token_type = null
                        lookahead = null
                        break;
                    case TypeENUM["Number-oct"]:
                        tokens.push([token_type,parseInt(data,8)])
                        data = ""
                        token_type = null
                        lookahead = null
                        break;
                    case TypeENUM["Number-bin"]:
                        tokens.push([token_type,parseInt(data,2)])
                        data = ""
                        token_type = null
                        lookahead = null
                        break;
                    case TypeENUM["Number-dec"]:
                    case TypeENUM["Flag-point"]:
                    case TypeENUM["Flag-jmp"]:
                    case TypeENUM["Register"]:
                        tokens.push([token_type,parseInt(data,10)])
                        data = ""
                        token_type = null
                        lookahead = null
                        break;
                    case TypeENUM["String"]:
                        tokens.push([token_type,data])
                        data = ""
                        token_type = null
                        lookahead = null
                        break;
                    case TypeENUM["Array"]:
                        data = data.split(" | ");
                        for (var i = 0; i < data.length; i++) {
                            self[i] = parseInt(data[i],10);
                        }
                        tokens.push([token_type,data])
                        data = ""
                        token_type = null
                        lookahead = null
                        break;
                }
                
            } else {
                // if we aren't ending a token just stuff it into data
                data += string.charAt(index)
            }
        }
    } // end for loop
    return tokens
}