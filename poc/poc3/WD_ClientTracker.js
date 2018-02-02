var util = require("util");

function WD_ClientTrackerException() { }

util.inherits(WD_ClientTrackerException, Error);

function WD_ClientTracker() {
  this._collection = {};
}

WD_ClientTracker.prototype.add = function add(wd_client) {
  if (wd_client.clientId in this._collection)
    throw new WD_ClientTrackerException("Already in collection");

  this._collection[wd_client.clientId] = wd_client;
  console.log(`Tracker now has ${this.count()} client(s)`);
};

WD_ClientTracker.prototype.remove = function remove(wd_client) {
  delete this._collection[wd_client.clientId];
  console.log(`Tracker now has ${this.count()} client(s)`);
};

WD_ClientTracker.prototype.count = function count() {
  return Object.keys(this._collection).length;
};

module.exports = WD_ClientTracker;
