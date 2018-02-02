var dispatch = {
  "clear": function clear(wd_client, tokens) {
    wd_client.cursor.eraseData(1);
  },
  "echo": function echo(wd_client, tokens) {
    wd_client.cursor.green().write(tokens.join(" ")).reset().write("\n");
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


function _no_such_command(wd_client, command) {
  wd_client.cursor.yellow().write("No such command: ").
    reset().write(command + "\n");
}

/*
 *
 * @param WD_Client wd_client   Object representing access to client
 * @param line String    User input
 *
 * @return Boolean  Indicates whether any such function exists in table
 */
function runLine(wd_client, line) {
  var tokens = _parse(line);

  if (tokens) {

    if (tokens[0] in dispatch) {
      dispatch[tokens[0]](wd_client, tokens);
      return true;
    }

    _no_such_command(wd_client, tokens[0]);
  }

  return false;
}

module.exports = {
  runLine: runLine
};
