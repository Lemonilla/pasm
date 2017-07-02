// TOFIX:
// Throws a XML Parsing Error when reading the json
//    but that doesn't stop it from working O.o


function getOpcodeByName(string){
	for(var i in opcodes){
		if(opcodes[i].Name == string){
			return opcodes[i]
		}
	}
//	console.log("Error, could not fine opcode \""+string+"\".")
	return null
}

function loadJSON(url)
{
    var http = new XMLHttpRequest();
    http.open('HEAD', url, false);
    http.send();
    if (http.status === 200){
      return JSON.parse(http.responseText);
    } else {
      console.log("Couldn't load file: "+url)
      console.log("Read request returned "+http.status)
      console.log(http.responseText)
      return null;
    }
}


// build opcodes list by combining opcodes.json and opcodes.user.json
// with priority to opcodes.user.json
// This will allow a user to specialize their own opcode names
var opcodes = loadJSON('./json/opcodes.default.json')
var userOpcodes = loadJSON('./json/opcodes.user.json')
if (userOpcodes !== null){
    for(var op in userOpcodes) {
        for (var name in userOpcodes[op]){
            opcodes[op][name] = userOpcodes[op][name];
        }
    }
}

console.log(opcodes)



