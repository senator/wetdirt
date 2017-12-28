var telnet = require("telnet");
var ansi = require("ansi");
var readline = require("readline");

function ClientIdentifier(socket) {
  var self = this;

  ["remotePort","remoteFamily","remoteAddress"].forEach(k => {
    self[k] = socket[k];
  });

  self.timestamp = new Date();
  self.randomPart = parseInt(Math.random() * (1024 * 1024 * 1024)).toString(16);
}

ClientIdentifier.prototype.toString = function toString() {
  return [
    String(Number(this.timestamp)),
    this.randomPart,
    this.remoteFamily,
    this.remoteAddress + ":" + this.remotePort
  ].join("-");
}

function clientWindowSizeHandler(evt) {
  if (evt.command == "sb") {
    console.log("cols, rows:", evt.cols, evt.rows);
  }
}

function clientDataHandler(cursor, data) {
  console.log("Received data:", data);
  cursor.write("Received: ").yellow().write(data).reset().write("\n");
}

function clientErrorHandler(id, err) {
  console.error(`${id} had error:`, err);
}

function clientEndHandler(clientId) {
  console.log(`${clientId} disconnected`);
}

function clientHandler(client) {
  var clientId = new ClientIdentifier(client.input);
  var cursor = ansi(client, {enabled: true});

  client.do.window_size();
  client.do.suppress_go_ahead();
  client.will.suppress_go_ahead();
  client.will.echo();

  client.on("window size", clientWindowSizeHandler);
  client.on("data", clientDataHandler.bind(null, cursor));
  client.on("end", clientEndHandler.bind(null, clientId));
  client.on("error", clientErrorHandler.bind(null, clientId));

  setTimeout(function() {
    var readline_interface = readline.createInterface({input: client.input,
      output: client.output});

    readline_interface.on("line", function(line) { console.log("readline:", line) });

  }, 1000);

}

telnet.createServer(clientHandler).listen(23069);


