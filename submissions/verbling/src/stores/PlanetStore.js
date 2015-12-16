'use strict';

import WebSocket from 'ws';
import EventEmitter from 'events';

var ws = new WebSocket('ws://localhost:4000');
var CHANGE_EVENT = 'changePlanet';

var _planet = {};

//Upon opening, sends a message to web socket to get the planet sent
ws.onopen = function() {
  ws.send('Planet plz');
};

//Updates the planet from websocket and emits change
ws.onmessage = function(message, flags) {
  _planet = JSON.parse(message.data);
  PlanetStore.emitChange();
};

var PlanetStore = Object.assign({}, EventEmitter.prototype, {
  getPlanet() {
    return _planet;
  },

  emitChange() {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }
});

export default PlanetStore;
