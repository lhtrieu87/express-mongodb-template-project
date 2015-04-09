'use strict';

function logErrors(err, req, res, next) {
  console.error('--------------------------');
  console.error(err.name);
  console.error(err.status);
  console.error(err.code);
  console.error(err.message);
  console.error(err.stack);
  console.error('--------------------------');
  next(err);
}

function productionErrorHandler(err, req, res, next) {
  if(err.name === 'CastError' && err.type === 'ObjectId') {
    err.status = 400;
    err.message = 'Invalid id!';
  }

  // Fall back to internal server error 500
  if(!err.status)
    err.status = 500;

  res.json(err.status, {
    errorCode: err.code,
    errorType: err.name,
    error: err.message
  });
}

module.exports = function (app) {
  var config = require('./config/environments');

  var errorHandler = require('errorhandler');

  // Only reach here for unsupported paths.
  app.use(require('./utils').notFound);

  app.use(logErrors);

  if(config.env === 'development') {
    // Only use in development, as the full error stack traces
    // will be sent back to the client when an error occurs.
    app.use(errorHandler());
  } else {
    // The same error handler for both test and production environments.
    app.use(productionErrorHandler);
  }
};
