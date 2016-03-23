'use strict';
var mongoose = require('mongoose');
var Promise = require('bluebird');
var Maps = Promise.promisifyAll(mongoose.model('Maps'));
var mapData = require('../rawData/maps.json');

function seedMaps () {
	return Maps.createAsync(
		mapData.map(function (element, index) {
			return {
				mapId: index + 1,
				data: element
			}
		})
	)
}

module.exports = seedMaps;