'use strict';

var path = require('path');
var _ = require('lodash');

function requiredProcessEnv(name) {
  if(!process.env[name])
    throw new Error('You must set the ' + name + ' environment variable');

  return process.env[name];
}

var base = {
  env: process.env.NODE_ENV,

  root: path.normalize(__dirname + '/../..'),

  ip: '127.0.0.1',
  port: process.env.PORT || 3000,

  seedDB: true,

  mongo: {
    options: {
      db: {
        safe: true
      }
    }
  }
};

module.exports = _.merge(base, require('./' + process.env.NODE_ENV + '.js') || {});
