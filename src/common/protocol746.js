var util = require("util");

function Command(command, params) {
  this.command = command;
  this.params = params;

  if (typeof command != "string")
    throw new Error("'command' must be string");

  if (!util.isArray(params) || params.some(p => typeof p != "string"))
    throw new Error("'params' must be array of strings");
}

function Display(displayList) {
  this.display = displayList;

  if (!util.isArray(this.display))
    throw new Error("'display' must be array");

  if (this.display.some(d => !util.isArray(d) ||
    d.length != 2 || typeof d[0] != "string" || typeof d[1] != "string")) {

    throw new Error("members of display must themselves be two-string arrays");
  }
}

function Expect(expect) {
  this.expect = expect;

  if (typeof expect != "string")
    throw new Error("'expect' must be string");
}

function Info(subject, content) {
  this.subject = subject;
  this.content = content; /* free form */

  if (typeof subject != "string")
    throw new Error("'subject' must be string");
}

module.exports = {
  Command,
  Display,
  Expect,
  Info
};
