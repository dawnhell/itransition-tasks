var currentEditor;

function runAce(code) {
  var editor = ace.edit("ace-editor");
  currentEditor = editor;
  editor.setTheme("ace/theme/github");
  editor.setValue(code);
  editor.setHighlightActiveLine(false);
  editor.clearSelection();
}

function destroyAce() {
  var editor = $("#ace-editor");
  editor.innerHTML = "";
}

function getCurrentCode() {
  return currentEditor.getValue();
}
