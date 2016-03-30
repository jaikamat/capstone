'use strict';
var mongoose = require('mongoose');

var schema = new mongoose.Schema({
  userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  levelStats: [{
    levelId: Number,
    completed: Boolean,
    unlocked: Boolean
  }]
});

schema.statics.getUserStatsByUserId = function(userId) {
  var self = this;
  return self.findOne({userId: userId}).then(function(userStats) {
    if (!userStats) {
      return self.init(userId);
    } else {
      return userStats;
    }
  });
};

var NUM_DIFFICULTIES = 4;
var NUM_LEVELS_PER_DIFFICULTY = 15;
var NUM_LEVELS = NUM_DIFFICULTIES * NUM_LEVELS_PER_DIFFICULTY;

schema.statics.init = function(userId) {
  var levelStats = [];
  for (var i = 1; i <= NUM_LEVELS; i++) {
    var levelStat = {
      levelId: i,
      completed: false,
      unlocked: i % NUM_LEVELS_PER_DIFFICULTY === 1 // this way, the first level for each difficulty will be unlocked by default
    };
    levelStats.push(levelStat);
  }
  return this.create({userId: userId, levelStats: levelStats});
};

mongoose.model('UserStats', schema);
