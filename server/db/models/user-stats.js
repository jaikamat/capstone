'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new mongoose.Schema({
  userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  levelStats: [{
    levelId: Number,
    completeBeginner: Boolean,
    completeIntermediate: Boolean,
    completeAdvanced: Boolean,
    completeExpert: Boolean
  }]
});

mongoose.model('userStats', schema);
