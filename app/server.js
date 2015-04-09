'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var express = require('express');
var mongoose = require('mongoose');
var config = require('./config/environments');

// Connect to database.
mongoose.connect(config.mongo.uri, config.mongo.options);
// Populate database with seed data.
if(config.seedDB) {
  require('./config/seed');
}

// Set up server.
var app = express();
// Config the server.
require('./config/express')(app);
require('./routes')(app);

app.listen(config.port, config.ip, function (error) {
  if(error) {
    console.error('Unable to listen for connections', error);
    process.exit(10);
  }

  console.info('Express is listening on http://' + config.ip + ':' + config.port);
});

// If the Node process ends, close the Mongoose connection.
process.on('SIGINT', function () {
  mongoose.connection.close(function () {
    console.log('Mongoose default connection disconnected through app termination');
    process.exit(0);
  });
});


module.exports = app;
