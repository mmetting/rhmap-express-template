'use strict';

var _ = require('lodash')
  , cache = require('fh-mbaas-api').cache
  , safejson = require('safejson')
  , VError = require('verror')
  , log = require('fh-bunyan').getLogger(__filename);


/**
 * Get a user by a specific property
 * @param  {String}   key
 * @param  {Mixed}    val
 * @param  {Function} callback
 */
var getUser = exports.getUser = function (id, callback) {
  log.debug('gettting user %s', id);
  cache({
    act: 'load',
    key: id
  }, function (err, data) {
    if (err) {
      callback(new VError(err, 'failed to load user from cache'));
    } else if (!data) {
      callback(null, null);
    } else {
      safejson.parse(data, callback);
    }
  });
};


/**
 * Write a user to the cache.
 * @param  {String}   id
 * @param  {Object}   data
 * @param  {Function} callback
 * @return {undefined}
 */
var writeUser = exports.writeUser = function (id, data, callback) {
  log.debug('writing user %s, with data', id, data);
  safejson.stringify(data, function (err, jsonStr) {
    if (err) {
      callback(new VError(err, 'failed to stringify user data'));
    } else {
      cache({
        act: 'save',
        key: id,
        value: jsonStr,
        expire: 600
      }, callback);
    }
  });
};


/**
 * Updates a user with the given data
 * @param  {String}   id
 * @param  {Object}   data
 * @param  {Function} callback
 */
exports.updateById = function (id, newUserData, callback) {
  log.debug('updating user %s, with data %j', id, newUserData);
  var newData = null;

  function onUserWritten (err) {
    if (err) {
      callback(new VError(err, 'failed to write user'));
    } else {
      callback(null, newData);
    }
  }

  getUser(id, function onUserLoaded (err, curUserData) {
    if (err) {
      callback(new VError(err, 'failed to load user'));
    } else if (!curUserData) {
      callback(null, null);
    } else {
      // merge the old and new data, but have the new data take priority
      newData = _.assign(curUserData, newUserData);

      writeUser(id, newData, onUserWritten);
    }
  });
};
