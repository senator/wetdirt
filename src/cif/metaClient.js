var ansi = require("ansi");
var readline = require("readline");

function _ClientIdentifier(socket) {
  var self = this;

  ["remotePort","remoteFamily","remoteAddress"].forEach(k => {
    self[k] = socket[k];
  });

  self.timestamp = new Date();
  self.randomPart = parseInt(Math.random() * (1024 * 1024 * 1024)).toString(16);
}

_ClientIdentifier.prototype.toString = function toString() {
  return [
    String(Number(this.timestamp)),
    this.randomPart,
    this.remoteFamily,
    this.remoteAddress + ":" + this.remotePort
  ].join("-");
}

function MetaClient(client, handlers) {
  this.client = client;
  this.clientId = new _ClientIdentifier(client.input);
  this.cursor = ansi(client, {enabled: true});
  this.cols = null;
  this.rows = null;

  this._terminal_configuration();
  this._setup_handlers(handlers);
}

MetaClient.prototype._terminal_configuration = function _tc() {
  this.client.do.window_size();
  this.client.do.suppress_go_ahead();
  this.client.will.suppress_go_ahead();
  this.client.will.echo();
};

MetaClient.prototype._setup_handlers = function _sh(handlers) {
  var self = this;
  handlers = handlers || {};

  this.client.on("window size", function(evt) {
    if (evt.command != "sb")
      return;

    self.rows = evt.rows;
    self.cols = evt.cols;
    console.log(`cols, rows for ${self.clientId}: ${self.cols}, ${self.rows}`);
  });

  if (handlers.end)
    this.client.on("end", handlers.end.bind(null, this));

  if (handlers.error)
    this.client.on("error", handlers.error.bind(null, this));

  if (handlers.line) {
    /* XXX setTimeout(..., 1000) here is a kludge.  There's some event to
     * wait for instead... */
    setTimeout(function() {
      var readline_interface = readline.createInterface({
        input: self.client.input,
        output: self.client.output,
        terminal: true
      });

      readline_interface.on("line", function(line) { handlers.line(self, line) });

    }, 1000);
  }
};

module.exports = {
  MetaClient: MetaClient
};
