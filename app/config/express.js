'use strict';

var compression = require('compression');

// Support DELETE, PATCH & PUT verbs.
var methodOverride = require('method-override');

var bodyParser = require('body-parser');

module.exports = function (app) {
  var env = app.get('env');

  app.use(compression());
  app.use(methodOverride());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true
  }));
};
