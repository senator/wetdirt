var telnet = require("telnet");
var commands = require("./commands");
var WD_Client = require("./WD_Client");

function wdClientErrorHandler(wd_client, err) {
  console.error(`${wd_client.clientId} had error:`, err);
}

function wdClientEndHandler(wd_client) {
  console.log(`${wd_client.clientId} disconnected`);
}

function clientHandler(client) {

  var wd_client = new WD_Client(client, {
    error: wdClientErrorHandler,
    end: wdClientEndHandler,
    line: commands.runLine
  });

}

telnet.createServer(clientHandler).listen(23069);


