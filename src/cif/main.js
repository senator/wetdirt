var telnet = require("telnet");
var commands = require("./commands");
var MetaClient = require("./metaClient").MetaClient;
var MetaClientTracker = require("./metaClientTracker").MetaClientTracker;

var tracker;

function _client_error_handler(client, err) {
  console.error(`${client.clientId} error:`, err);
}

function _client_end_handler(client) {
  console.log(`${client.clientId} disconnected`);
  tracker.remove(client);
}

function _telnet_client_handler(client) {

  tracker.add(
    new MetaClient(client, {
      error: _client_error_handler,
      end: _client_end_handler,
      line: commands.runLine
    })
  );

}

tracker = new MetaClientTracker();
telnet.createServer(_telnet_client_handler).listen(20243);
