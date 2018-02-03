var parse = require("shell-quote").parse;
var colorMap = require("./colorMap");
var protocol746 = require("../common/protocol746");

var localDispatch = {
  "clear": function clear(metaClient, tokens) {
    metaClient.cursor.eraseData(1);
  },
  "echo": function echo(metaClient, tokens) {
    var message = tokens.slice(1).join(" ");
    metaClient.beginOut();
    colorMap.info(metaClient.cursor, message);
    metaClient.endOut();
  },
  "quit": function quiet(metaClient, tokens) {
    metaClient.beginOut();
    colorMap.info(metaClient.cursor, "Goodbye!");
    metaClient.endOut();
    metaClient.client.end();
  },
  "test": function test(metaClient, tokens) {
    var count;

    if (tokens.length >= 2 && (count = Number(tokens[1]))) {
      metaClient.beginOut();
      colorMap.debug(metaClient.cursor, `Will callback ${count} times`);
      metaClient.endOut();
      
      for (var i = 0; i < count; i++) {
        setTimeout((function(j) {
          metaClient.beginOut();
          colorMap.alarm(metaClient.cursor, `Here I am on iteration ${j}`);
          metaClient.endOut();
        }).bind(null, i) , (i + 1) * 1000);
      }
    } else {
      metaClient.beginOut();
      colorMap.warning(metaClient.cursor, `Doing nada since tokens.length is ${tokens.length}`);
      metaClient.endOut();
    }
  }
};


function tryServerCommand(metaClient, tokens) {
  var cmd = new protocol746.Command(tokens[0], tokens.slice(1));

  metaClient.beginOut();
  colorMap.warning(metaClient.cursor, "Would send: ");
  colorMap.info(metaClient.cursor, JSON.stringify(cmd));
  metaClient.endOut();
}

function dumbDown(shellTokens) {
  return shellTokens.
    map(t => t.op ? (t.op == "glob" ? t.pattern : t.op) : t).
    filter(t => typeof t == "string");
}

/*
 * @param {MetaClient} metaClient Represents access to client
 * @param {String} line           User input
 *
 * @return {Boolean}  Indicates whether any command was run
 */
function runLine(metaClient, line) {
  var tokens = dumbDown(parse(line));

  if (tokens.length) {

    if (tokens[0] in localDispatch) {
      localDispatch[tokens[0]](metaClient, tokens);
      return true;
    }

    /* XXX this will be conditional on sim connection of course */
    tryServerCommand(metaClient, tokens);
  }

  return false;
}

module.exports = {
  runLine: runLine
};
