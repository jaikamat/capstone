'use strict';
var mongoose = require('mongoose');

var schema = new mongoose.Schema({
  startNode: {type: Number, min: 0},
  endNode: {type: Number, min: 0},
  redTokens: {type: Number, min: 0},
  blueTokens: {type: Number, min: 0},
  greenTokens: {type: Number, min: 0},
  gems: [Number],
  conditionals: [Schema.Types.Mixed]
});

mongoose.model('Params', schema);


