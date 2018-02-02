var ansi = require("ansi");
var readline = require("readline");
var WD_ClientIdentifier = require("./WD_ClientIdentifier");

function WD_Client(client, handlers) {
  this.client = client;
  this.clientId = new WD_ClientIdentifier(client.input);
  this.cursor = ansi(client, {enabled: true});
  this.cols = null;
  this.rows = null;

  this._terminal_configuration();
  this._setup_handlers(handlers);
  console.log("boom");
}

WD_Client.prototype._terminal_configuration = function _tc() {
  this.client.do.window_size();
  this.client.do.suppress_go_ahead();
  this.client.will.suppress_go_ahead();
  this.client.will.echo();
};

WD_Client.prototype._setup_handlers = function _sh(handlers) {
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

module.exports = WD_Client;
