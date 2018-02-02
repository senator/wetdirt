var telnet = require("telnet");
var commands = require("./commands");
var WD_Client = require("./WD_Client");
var WD_ClientTracker = require("./WD_ClientTracker");

var wd_clienttracker;

function _wd_client_error_handler(wd_client, err) {
  console.error(`${wd_client.clientId} error:`, err);
}

function _wd_client_end_handler(wd_client) {
  console.log(`${wd_client.clientId} disconnected`);
  wd_clienttracker.remove(wd_client);
}

function _telnet_client_handler(client) {

  wd_clienttracker.add(
    new WD_Client(client, {
      error: _wd_client_error_handler,
      end: _wd_client_end_handler,
      line: commands.runLine
    })
  );

}

wd_clienttracker = new WD_ClientTracker();
telnet.createServer(_telnet_client_handler).listen(23069);
