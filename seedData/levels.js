'use strict';
var mongoose = require('mongoose');
var Promise = require('bluebird');
var Levels = Promise.promisifyAll(mongoose.model('Levels'));
var Maps = mongoose.model('Maps');
var Scrolls = mongoose.model('Scrolls');
var Params = mongoose.model('Params');

var levelData = require('./levels.json');

function seedLevels () {
	return Promise.each(levelData, function (level, index) {
		var mapQuery = Maps.findOne({mapId: level.map});
		var scrollQuery = Scrolls.findOne({scrollId: level.scroll});
		var paramQuery = Params.findOne({paramId: index + 1});
		var query = [mapQuery, scrollQuery, paramQuery];
		return Promise.all(query)
		.spread(function (map, scroll, params) {
			return Levels.createAsync({
				levelId: index + 1,
				map: map._id,
				scroll: scroll._id,
				params: params._id
			})
		})
	})
}

module.exports = seedLevels;


