var mongoose = require('mongoose');
var config = require('./../config/environments');

var _ = require('lodash');
var Q = require('q');

function removeProperty(obj, property) {
  obj.should.have.property(property);
  delete obj[property];
}

function randomString(length) {
  return Math.random().toString(36).substring(length);
}

function randomObjectId() {
  var ObjectID = require('mongodb').ObjectID;
  return new ObjectID();
}

function connectDb() {
  var deferred = Q.defer();

  mongoose.connect(config.mongo.uri, config.mongo.options, function (err) {
    if(err)
      deferred.reject(err);
    else
      deferred.resolve();
  });

  return deferred.promise;
}

function disconnectDb() {
  var deferred = Q.defer();

  mongoose.disconnect(function (err) {
    if(err)
      deferred.reject(err);
    else
      deferred.resolve();
  });

  return deferred.promise;
}

function dropDb() {
  var promises = _.map(mongoose.connection.collections, function (collection) {
    var deferred = Q.defer();
    collection.remove(function (err) {
      if(err)
        deferred.reject(err);
      else
        deferred.resolve();
    });

    return deferred.promise;
  });

  return promises;
}

function connectThenDropDb() {
  // Already connected, do nothing.
  if(mongoose.connection.readyState === 1)
    return Q.fcall(dropDb);
  // Connecting.
  else if(mongoose.connection.readyState === 2) {
    var onceConnected = function () {
      var deferred = Q.defer();

      mongoose.connection.once('connected', function (err) {
        if(err)
          deferred.reject(err);
        else
          deferred.resolve();
      });

      return deferred.promise;
    }

    return Q.fcall(onceConnected).then(dropDb);
  }

  return Q.fcall(connectDb).then(dropDb);
}

function dropThenDisconnectDb() {
  return Q.fcall(dropDb).then(disconnectDb);
}

function createRandomObjectPromise(fakery, objectName) {
  var deferred = Q.defer();

  fakery.makeAndSave(objectName, function (err, obj) {
    if(err)
      deferred.reject(err);
    else
      deferred.resolve(obj);
  });

  return deferred.promise;
}

function genRandomObjectsPromise(objectCount, fakery, objectName) {
  var promises = [];

  for(var i = 0; i < objectCount; i++) {
    promises[i] = createRandomObjectPromise(fakery, objectName);
  }

  if(objectCount === 1)
    return promises[0];
  else if(objectCount > 1)
    return Q.all(promises);
}

(function () {
  var fakery = require('mongoose-fakery');
  var Faker = require('faker');

  fakery.generator('fullName', function () {
    return Faker.Name.findName();
  });

  fakery.generator('imageUrl', function () {
    return Faker.random.avatar_uri();
  });

  fakery.generator('sentence', function () {
    return Faker.Lorem.sentence();
  });

  fakery.generator('address', function () {
    return Faker.Address.streetAddress();
  });

  fakery.generator('number', function (max) {
    max = max || 1000;
    return Faker.Helpers.randomNumber(max);
  });

  fakery.generator('objectId', function () {
    return randomObjectId();
  });

  fakery.generator('randomString', function (length) {
    return randomString(length);
  });

  fakery.generator('phoneNo', function () {
    return Faker.PhoneNumber.phoneNumber();
  });

  fakery.generator('date', function (future) {
    return future ? Faker.Date.future(0) : Faker.Date.past(0);
  });
})();

module.exports = {
  removeProperty: removeProperty,
  randomString: randomString,
  randomObjectId: randomObjectId,
  connectThenDropDb: connectThenDropDb,
  dropThenDisconnectDb: dropThenDisconnectDb,
  dropDb: dropDb,
  disconnectDb: disconnectDb,
  genRandomObjectsPromise: genRandomObjectsPromise
};