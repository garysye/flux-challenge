'use strict';

import AppDispatcher from '../dispatchers/AppDispatcher';
import {EventEmitter} from 'events';
import SithConstants from '../constants/SithConstants';
import request from 'superagent';
import PlanetStore from './PlanetStore';

var CHANGE_EVENT = 'changeSith';
var API_URL = 'http://localhost:3000/dark-jedis/';

var _sith = [];
var _queryAvail = {
  apprentice: true,
  master: true
}
var _sithAlert = false;
var _request = [];

//Retrieves Sith from server
function getSith(sithId, ind, cb) {
  var newRequest = request
                    .get(API_URL + sithId)
                    .end((err, res) => {
                      if (err) {
                        console.error(err);
                      } else {
                        _sith[ind] = res.body;
                        checkAvailStatus()
                        SithStore.emitChange();
                        cb && cb();
                      }
                    });
  // Stores the current request with its index in case it has to be cancelled later
  _request = [ind, newRequest];
};

//Goes through the list of Sith and retrives their master if possible
function getMasters(startIndex) {
  var masterId;
  //Starts iterating up from a provided start if available, else from the bottom
  for (var i = startIndex || _sith.length - 2; i >= 0; i--) {
    if (_sith[i] === undefined && _sith[i + 1] !== undefined) {
      masterId = _sith[i + 1].master.id;
      //If an index is empty and the following Sith has a master, retrieves it
      if (masterId) {
        getSith(masterId, i, () => getMasters(i - 1));
      }
      break;
    }
  }
};

//Goes through the list of Sith and retrives their apprentice if possible
function getApprentices(startIndex) {
  var apprenticeId;
  for (var i = startIndex || 1; i < _sith.length; i++) {
    //Starts iterating down from a provided start if available, else from the top
    if (_sith[i] === undefined && _sith[i - 1] !== undefined) {
      apprenticeId = _sith[i - 1].apprentice.id;
      //If an index is empty and the previous Sith has an apprentice, retrives it
      if (apprenticeId) {
        getSith(apprenticeId, i, () => getApprentices(i + 1));
      }
      break;
    }
  }
};

//Checks if the current request is out of bounds, and cancels it if it is
function updateRequests(num) {
  if ((num > 0 && _request[0] + num >= _sith.length) || (num < 0 && _request[0] + num < 0)) {
    _request[1].abort();
  }
};

//Iterates through the list of Sith and checks if a master or apprentice is available
function checkAvailStatus() {
  var len = _sith.length;
  for (var i = 0; i < _sith.length; i++) {
    if (_sith[i]) {
      if (!_sith[i].master.id) {
        _queryAvail.master = false;
      }
      if (!_sith[i].apprentice.id) {
        _queryAvail.apprentice = false;
      }
    }
  }
};

//Iterates through the list of Sith and checks if their homeworld matches a planet
function comparePlanets(planet) {
  _sithAlert = false;
  for (var i = 0; i < _sith.length; i++) {
    if (_sith[i]) {
      if (_sith[i].homeworld.name === planet.name) {
        _sithAlert = true;
        _sith[i].alert = true;
        _request[1].abort();
      } else {
        _sith[i].alert = false;
      }
    }
  }
};

//Moves the list of Sith up by a number of slots
function moveListUp(num) {
  var len = _sith.length;
  //Resets the master availability indicator
  _queryAvail.master = true;
  num = num || 2;
  //Removes specific number of slots from the beginning
  _sith.splice(0, num);
  //Adds same number of empty slots to the end
  _sith = _sith.concat(new Array (num));
  updateRequests(-num);
  getApprentices();
};

//Moves the list of Sith down by a number of slots
function moveListDown(num) {
  var len = _sith.length;
  //Resets the apprentice availability indicator
  _queryAvail.apprentice = true;
  num = num || 2;
  //Removes specifc number of slots from the end
  _sith.splice(len - num, num);
  //Adds same number of empty slots to the start
  _sith = new Array(num).concat(_sith);
  updateRequests(num);
  getMasters();
};

//Initializes the store's functionality
function initialize(num, sithId) {
  sithId = sithId || 3616;
  _sith = new Array(num);

  //Adds an event listener for when Obi-wan's planet changes
  PlanetStore.addChangeListener(() => {
    comparePlanets(PlanetStore.getPlanet());
    SithStore.emitChange();
  });

  //Starts getting apprentices starting with Darth Sidious
  getSith(sithId, 0, () => getApprentices());
};

var SithStore = Object.assign({}, EventEmitter.prototype, {


  getSith() {
    return _sith;
  },

  isApprenticeAvail() {
    return _queryAvail.apprentice;
  },

  isMasterAvail() {
    return _queryAvail.master;
  },

  getSithAlert() {
    return _sithAlert;
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
})

//Sets up App Dispatcher to listen for specfic actions
AppDispatcher.register((action) => {
  switch (action.actionType) {
    case SithConstants.INITIALIZE:
      initialize(action.numSlots, action.sithId);
      SithStore.emitChange();
      break;
    case SithConstants.SCROLL_UP:
      moveListDown(action.numSlots);
      SithStore.emitChange();
      break;
    case SithConstants.SCROLL_DOWN:
      moveListUp(action.numSlots);
      SithStore.emitChange();
      break;
    default:
  }
});

export default SithStore;
