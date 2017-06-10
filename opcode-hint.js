(function(mod) {
  if (typeof exports == "object" && typeof module == "object") // CommonJS
    mod(require("Dependencies/codeMirror/lib/codemirror"));
  else if (typeof define == "function" && define.amd) // AMD
    define(["Dependencies/codeMirror/lib/codemirror"], mod);
  else // Plain browser env
    mod(CodeMirror);
})
(function(CodeMirror){
	var WORD = /[\w$]+/, RANGE = 500;
	CodeMirror.registerHelper("hint", "opcodes", function(editor, options) {
	    var word = options && options.word || WORD;
	    var range = options && options.range || RANGE;
	    var cur = editor.getCursor()
	    var curLine = editor.getLine(cur.line);
	    var end = cur.ch
	    var start = end;
	    while (start && word.test(curLine.charAt(start - 1))) --start;
	    var curWord = start != end && curLine.slice(start, end);

		list = [];
		for(var key in opcodes){
			if (opcodes[key].Name.indexOf(curWord) != -1){
				list.push(opcodes[key].Name);
			}
		}
		list = list.sort();
	    return {list: list, from: CodeMirror.Pos(cur.line, start), to: CodeMirror.Pos(cur.line, end)};
	});
});