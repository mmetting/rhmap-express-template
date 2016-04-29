'use strict';

module.exports = function (app) {
  var route = new require('express').Router();

  // Bind our router as a /users API
  app.use('/error-example', route);

  // Try to parse body if request has "Content-Type: application/json"
  route.use(require('body-parser').json());

  route.get('/', function (req, res, next) {
    next(new Error('oops, an something broke!'));
  });
};
