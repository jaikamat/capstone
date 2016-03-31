'use strict';
var router = require('express').Router();
var UserStats = require('mongoose').model('UserStats');

router.get('/:userId', function(req, res, next) {

  UserStats.getUserStatsByUserId(req.params.userId)
      .then(function(userStats) {
        res.json(userStats);
      })
      .then(null, next);
});

router.put('/', function(req, res, next) {
    if(!req.user) {
      res.status(401).end();
    }
    else {
      UserStats.getUserStatsByUserId(req.user._id)
          .then(function (userStats) {
            userStats.levelStats[req.body.level - 1].completed = true;
            userStats.levelStats[req.body.level].unlocked = true;
            userStats.save();
          })
          .then(function () {
            res.status(201).end();
          })
          .then(null, next);
    }
});

module.exports = router;
