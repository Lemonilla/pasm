var regexs = [
   // 1 line Comment
  {regex: /\/\/.*/, token: "comment"},

  // Flag
  {regex: /[0-9]*:[$|\t]/, token: "flag"},
  {regex: /\@[a-z|A-Z][a-z|A-Z|0-9|_]*:$/, token: "flag"},
  {regex: /:[0-9]*/, token: "flag"},

  // Strings
  {regex: /'(?:[^\\]|\\.)*?(?:'|$)/, token: "string"},
  {regex: /"(?:[^\\]|\\.)*?(?:"|$)/, token: "string"},

  // Registers
  {regex: /\b[R|r]([1-2][0-9][0-9]|[0-9][0-9]|[0-9])\b/, token: "variable"},

  // Numbers
  {regex: /\s0x[0-9|A-F|a-f]+\b/, token: "number"},
  {regex: /\s[0-9]+\b/, token: "number"}
]
var list = []
for(var key in opcodes){
  list.push(opcodes[key])
}

list.sort(function(a, b){
  return a.Name.length - b.Name.length;
  });

for (var obj in list){
  var re = new RegExp("("+list[obj].Name+")\\b")
  var v = "keyword-"+list[obj].Version.toString();
  regexs.splice(1,0,
  {
    regex: re,
    token: v,
    sol: true
  });
}
console.log(regexs)

CodeMirror.defineSimpleMode("pasm", {
  start: regexs,
  meta: {
    dontIndentStates: ["comment"],
    lineComment: "//"
  }
});
console.log("fin")