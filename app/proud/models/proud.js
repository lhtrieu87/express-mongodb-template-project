'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var atLeastOne = function (arr) {
  return arr.length;
}

var Proud = new Schema({
  imageUrl: {
    type: String,
    trim: true,
    required: true
  },

  brands: {
    type: [String],
    validate: [
      atLeastOne
    ]
  },

  tags: [String],

  text: {
    type: String,
    trim: true
  },

  shareVia: [String],
  recipients: [String]
});

var ProudModel;
if(mongoose.models['Proud'])
  ProudModel = mongoose.model('Proud');
else
  ProudModel = mongoose.model('Proud', Proud);

module.export = {
  Proud: ProudModel
};
