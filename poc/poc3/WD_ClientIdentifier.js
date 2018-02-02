function WD_ClientIdentifier(socket) {
  var self = this;

  ["remotePort","remoteFamily","remoteAddress"].forEach(k => {
    self[k] = socket[k];
  });

  self.timestamp = new Date();
  self.randomPart = parseInt(Math.random() * (1024 * 1024 * 1024)).toString(16);
}

WD_ClientIdentifier.prototype.toString = function toString() {
  return [
    String(Number(this.timestamp)),
    this.randomPart,
    this.remoteFamily,
    this.remoteAddress + ":" + this.remotePort
  ].join("-");
}


module.exports = WD_ClientIdentifier;
