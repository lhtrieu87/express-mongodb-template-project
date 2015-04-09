var Q = require('q');
var testUtils = require('./test_utils');

before(function (done) {
  Q.fcall(testUtils.connectThenDropDb).then(function () {
    done();
  });
});

beforeEach(function (done) {
  Q.fcall(testUtils.dropDb).then(function () {
    done();
  });
});

after(function (done) {
  Q.fcall(testUtils.disconnectDb).then(function () {
    done();
  });
});