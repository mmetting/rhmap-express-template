'use strict';

var urls = {};
var log = require('fh-bunyan').getLogger(__filename);

/**
 * Returns our URL list Object to a callee
 * @return {Object}
 */
exports.getList = function () {
  return urls;
};


/**
 * Update the number of times the specified URL has been called
 * @param  {String} url
 * @return {Number}
 */
exports.incrementForUrl = function (url) {
  if (!urls.hasOwnProperty(url)) {
    log.trace('first call to %s', url);
    urls[url] = 1;
  } else {
    log.trace('increasing count for url %s', url);
    urls[url]++;
  }
};
