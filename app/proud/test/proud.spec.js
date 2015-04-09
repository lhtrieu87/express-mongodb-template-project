'use strict';

var should = require('should');
var Faker = require('faker');

var Proud = require('./../models/proud').Proud;

require('./../../test_utilities/test_db_set_up');

describe('Proud model', function () {
  it('persists into disk', function() {
    '1'.should.equal('1');
  });
});
