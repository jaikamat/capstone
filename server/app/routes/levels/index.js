'use strict';
var router = require('express').Router();
var Levels = require('mongoose').model('Levels');

router.get('/', function (req, res, next) {
	Levels.count({})
	.then(function (levelCount) {
		res.json(levelCount);
	})
	.then(null, next);
});

router.get('/:levelId', function (req, res, next) {
	var levelId = req.params.levelId;
	Levels.findOne({levelId: levelId})
	.populate('map scroll params')
	.then(function (level) {
		res.json(level);
	})
	.then(null, next);
});

module.exports = router;