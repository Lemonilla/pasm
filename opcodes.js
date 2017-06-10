
function getOpcodeByName(string){
	for(var i in opcodes){
		if(opcodes[i].Name == string){
			return opcodes[i]
		}
	}
	console.log("Error, could not fine opcode \""+string+"\".")
	return null
}

function loadJSON(filePath) {
  // Load json file;
  var json = loadTextFileAjaxSync(filePath, "application/json");
  // Parse json
  return JSON.parse(json);
}   
function loadTextFileAjaxSync(filePath, mimeType)
{
  var xmlhttp=new XMLHttpRequest();
  xmlhttp.open("GET",filePath,false);
  if (mimeType != null) {
    if (xmlhttp.overrideMimeType) {
      xmlhttp.overrideMimeType(mimeType);
    }
  }
  xmlhttp.send();
  if (xmlhttp.status==200)
  {
    return xmlhttp.responseText;
  }
  else {
    // TODO Throw exception
    return null;
  }
}

// build opcodes list by combining opcodes.json and opcodes.user.json
// with priority to opcodes.user.json
// This will allow a user to specialize their own opcode names
var opcodes = loadJSON('../json/opcodes.default.json')
var userOpcodes = loadJSON('../json/opcodes.user.json')
if (userOpcodes !== null){
    for(var op in userOpcodes) {
        for (var name in userOpcodes[op]){
            opcodes[op][name] = userOpcodes[op][name];
        }
    }
}
