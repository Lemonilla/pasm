  var list = []
  for(var key in opcodes){
    list.push(opcodes[key])
  }

  list.sort(function(a, b){
    // ASC  -> a.length - b.length
    // DESC -> b.length - a.length
    return b.Name.length - a.Name.length;
    });

  var REGEXkeywords_1 = "^("
  var REGEXkeywords_2 = "^("
  var REGEXkeywords_3 = "^("
  for(var i in list){
    if (list[i].Version === 1){
      REGEXkeywords_1+=list[i].Name+"|"
    } else if (list[i].Version === 2){
      REGEXkeywords_2+=list[i].Name+"|"
    } else if (list[i].Version === 3){
      REGEXkeywords_3+=list[i].Name+"|"
    } else {
      REGEXkeywords_1+=list[i].Name+"|"
    }
  }
  // trim off extra OR from our lists
  if (REGEXkeywords_1.length > 2) REGEXkeywords_1 = REGEXkeywords_1.substring(0, REGEXkeywords_1.length - 1);
  if (REGEXkeywords_2.length > 2) REGEXkeywords_2 = REGEXkeywords_2.substring(0, REGEXkeywords_2.length - 1);
  if (REGEXkeywords_3.length > 2) REGEXkeywords_3 = REGEXkeywords_3.substring(0, REGEXkeywords_3.length - 1);
  REGEXkeywords_1 += ")"
  REGEXkeywords_2 += ")"
  REGEXkeywords_3 += ")"
  if (REGEXkeywords_1.length == 3) REGEXkeywords_1 = "$^";
  if (REGEXkeywords_2.length == 3) REGEXkeywords_2 = "$^";
  if (REGEXkeywords_3.length == 3) REGEXkeywords_3 = "$^";
  var REGEX_re_1 = new RegExp(REGEXkeywords_1,"");
  var REGEX_re_2 = new RegExp(REGEXkeywords_2,"");
  var REGEX_re_3 = new RegExp(REGEXkeywords_3,"");


  CodeMirror.defineSimpleMode("pasm", {
    start: [
       // 1 line Comment
      {regex: /\/\/.*/, token: "comment"},

      // Keywords, see above
      {regex: REGEX_re_1, token: "keyword-1"},
      {regex: REGEX_re_2, token: "keyword-2"},
      {regex: REGEX_re_3, token: "keyword-3"},

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
      //{regex: /\b0x[a-f\d]+|[-+]?(?:\.\d+|\d+\.?\d*)(?:e[-+]?\d+)?\b/i, token: "number"}
      {regex: /\s0x[0-9|A-F|a-f]+\b/, token: "number"},
      {regex: /\s[0-9]+\b/, token: "number"}
  //    {regex: /\/(?:[^\\]|\\.)*?\//, token: "variable-3"},


    ],
    // PROBABLY WILL NOT GET ENABLED
    // The multi-line comment state.
  //  comment: [
  //    {regex: /.*?\*\//, token: "comment", next: "start"},
  //    {regex: /.*/, token: "comment"}
  //  ],


    // The meta property contains global information about the mode. It
    // can contain properties like lineComment, which are supported by
    // all modes, and also directives like dontIndentStates, which are
    // specific to simple modes.
    meta: {
      dontIndentStates: ["comment"],
      lineComment: "//"
    }
  });



return
break
  
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
