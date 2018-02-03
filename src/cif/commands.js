var dispatch = {
  "clear": function clear(metaClient, tokens) {
    metaClient.cursor.eraseData(1);
  },
  "echo": function echo(metaClient, tokens) {
    metaClient.cursor.green().write(tokens.join(" ")).reset().write("\n");
  },
  "quit": function quiet(metaClient, tokens) {
    metaClient.client.end();
  },
  "test": function test(metaClient, tokens) {
    var count;

    if (tokens.length >= 2 && (count = Number(tokens[1]))) {
      metaClient.cursor.cyan().write(`Will callback ${count} times`).reset().write("\n");
      
      for (var i = 0; i < count; i++) {
        setTimeout(function() {
          metaClient.cursor.red().write(`Here I am on iteration ${i}`).reset().write("\n");
        } , (i + 1) * 1000);
      }
    } else {
      metaClient.cursor.yellow().write(`Doing nada since tokens.length is ${tokens.length}\n`).reset();
    }
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


function _no_such_command(metaClient, command) {
  metaClient.cursor.yellow().write("No such command: ").
    reset().write(command + "\n");
}

/*
 *
 * @param WD_Client metaClient   Object representing access to client
 * @param line String    User input
 *
 * @return Boolean  Indicates whether any such function exists in table
 */
function runLine(metaClient, line) {
  var tokens = _parse(line);

  if (tokens) {

    if (tokens[0] in dispatch) {
      dispatch[tokens[0]](metaClient, tokens);
      return true;
    }

    _no_such_command(metaClient, tokens[0]);
  }

  return false;
}

module.exports = {
  runLine: runLine
};
