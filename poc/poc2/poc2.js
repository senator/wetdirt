var telnet = require("telnet");
var ansi = require("ansi");

function clientWindowSizeHandler(evt) {
  console.log("Received window size event:", evt);
}

function clientDataHandler(cursor, data) {
  console.log("Received data:", data);
  cursor.write("Received: ").yellow().write(data).reset().write("\n");
}

function clientHandler(client) {
  client.do.window_size();

  client.on("window size", clientWindowSizeHandler);
  client.on(
    "data",
    clientDataHandler.bind(null, ansi(client, {enabled: true}))
  );

  /* N.B. the {enabled: true} argument to ansi() above is key, because
   * Node doesn't see the stream on the "client" object from telnet as a TTY,
   * so we have to nudge the "ansi" module to treat it as one. */
}

telnet.createServer(clientHandler).listen(23069);


