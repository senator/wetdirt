var util = require("util");

function MetaClientTracker() {
  this._collection = {};
}

MetaClientTracker.prototype.add = function add(metaClient) {
  if (metaClient.clientId in this._collection)
    throw new Error("Already in collection");

  this._collection[metaClient.clientId] = metaClient;
  console.log(`Tracker now has ${this.count()} client(s)`);
};

MetaClientTracker.prototype.remove = function remove(metaClient) {
  delete this._collection[metaClient.clientId];
  console.log(`Tracker now has ${this.count()} client(s)`);
};

MetaClientTracker.prototype.count = function count() {
  return Object.keys(this._collection).length;
};

module.exports = {
  MetaClientTracker
};
