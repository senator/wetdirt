var dispatch = {
  "clear": function clear(cursor, tokens) {
    cursor.eraseData(1);
  },
  "echo": function echo(cursor, tokens) {
    cursor.green().write(tokens.join(" ")).reset().write("\n");
  }
};

/* Simplistic string-to-tokens function
 *
 * @param string  String  User's input, full of whitespace
 *
 * @return String|null  First token only, no whitespace
 */
function _parse(string) {
  try {
    return string.trim().split(/\s+/);
  } catch (e) {
    return null;
  }
}


function _no_such_command(cursor, command) {
  cursor.yellow().write("No such command: ").reset().write(command + "\n");
}

/*
 *
 * @param cursor Cursor   Stream through which to respond to client
 * @param line String    User input
 *
 * @return Boolean  Indicates whether any such function exists in table
 */
function runLine(cursor, line) {
  var tokens = _parse(line);

  if (tokens) {

    if (tokens[0] in dispatch) {
      dispatch[tokens[0]](cursor, tokens);
      return true;
    }

    _no_such_command(cursor, tokens[0]);
  }

  return false;
}

module.exports = {
  runLine: runLine
};
