'use strict';
var router = require('express').Router();
var UserStats = require('mongoose').model('UserStats');

router.get('/:userId', function(req, res, next) {
  console.log('CHALK');
  UserStats.getStatsByUserId(req.params.userId)
      .then(function(userStats) {
        res.json(userStats);
      })
      .then(null, next);
});

module.exports = router;
