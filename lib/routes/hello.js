'use strict';

var route = new require('express').Router();

module.exports = function (app) {

  // Used to extract the "hello" name property from an object
  function getName (data) {
    return (data && data.hello) ? data.hello : 'World';
  }

  function genResponse (data) {
     return 'Hello, ' + getName(data);
  }

  // Bind our router as a /users API
  app.use('/hello', route);

  // Try to parse body if request has "Content-Type: application/json"
  route.use(require('body-parser').json());

  route.get('/', function (req, res) {
    res.json({
      msg: genResponse(req.query)
    });
  });

  route.post('/', function (req, res) {
    res.json({
      msg: genResponse(req.body)
    });
  });
};
