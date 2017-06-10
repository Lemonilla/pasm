var regexs = [
   // 1 line Comment
  {regex: /\/\/.*/, token: "comment"},

  // Flag
  { regex: /F[0-9]+/, token: "flag", sol: true },
  {regex: /Fn[0-9]+:/, token: "flag", sol: true},
  {regex: /Fn_[0-9]+:/, token: "flag", sol: true},
  {regex: /:[0-9]+/, token: "flag"},
  {regex: /:\@[a-z|A-Z][a-z|A-Z|0-9|_]*/, token: "flag"},

  // Strings
  {regex: /'(?:[^\\]|\\.)*?(?:'|$)/, token: "string"},
  {regex: /"(?:[^\\]|\\.)*?(?:"|$)/, token: "string"},

  // Registers
  {regex: /\b[R|r]([1-2][0-9][0-9]|[0-9][0-9]|[0-9])\b/, token: "variable"},

  // Numbers
  {regex: /\s0x[0-9|A-F|a-f]+\b/, token: "number"},
  {regex: /\s[0-9]+\b/, token: "number"}
]
// build list of keywords
var list = []
for(var key in opcodes){
  list.push(opcodes[key])
}

// sort so we don't terminate our checks early
// and only highlight portions of the opcode
// that match shorter opcodes
list.sort(function(a, b){
  return a.Name.length - b.Name.length;
  });

// form regex for each opcode and insert them
// into the list of checks in order
// so the longest ones get checked first.
for (var obj in list){
  var name = list[obj].Name
    .replace("=","\\=")
    .replace("<","\\<")
    .replace(">","\\>")
    
  var re = new RegExp("("+name+")\\b")
  var v = "keyword-"+list[obj].Version.toString();
  regexs.splice(1,0,
  {
    regex: re,
    token: v
  });
}

// apply the checks
CodeMirror.defineSimpleMode("pasm", {
  start: regexs,
  meta: {
    dontIndentStates: ["comment"],
    lineComment: "//"
  }
});