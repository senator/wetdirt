var ansi = require("ansi");

function test() {
  var cursor = ansi(process.stdout);

  cursor.yellow().bg.cyan().write("test thing").reset().bg.reset().write("\n");
}

test();


