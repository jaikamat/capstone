'use strict';
var router = require('express').Router();
var Levels = require('mongoose').model('Levels');
var UserStats = require('mongoose').model('UserStats');

router.get('/', function (req, res, next) {
  Levels.count({})
      .then(function (levelCount) {
        res.json(levelCount);
      })
      .then(null, next);
});

router.get('/:levelId', function (req, res, next) {
  var levelId = req.params.levelId
  if(!req.user) {
  // how many levels you have access to
    if(req.params.levelId <= 60) {
      Levels.findOne({levelId: levelId})
          .populate('map scroll params')
          .then(function (level) {
            res.json(level);
          })
          .then(null, next);
    }
    else {
      res.send("tutorialEnd");
    }
  }
  else {
    UserStats.getUserStatsByUserId(req.user._id)
        .then(function(userStats) {
          if(userStats.levelStats[levelId-1].unlocked) {
            Levels.findOne({levelId: levelId})
                .populate('map scroll params')
                .then(function (level) {
                  res.json(level);
                })
                .then(null, next);
          }
          else {
            res.send("playMore");
          }
        })
  }
});

module.exports = router;
