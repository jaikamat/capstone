'use strict';
var mongoose = require('mongoose');
var Promise = require('bluebird');
var Maps = Promise.promisifyAll(mongoose.model('Maps'));
var mapData = require('../rawData/maps.json');

function seedMaps () {
	return Maps.createAsync(
		mapData.map(function (element, index) {
			console.log(element.nodeCoords)
			return {
				mapId: index + 1,
				data: element.data,
				nodeCoords: element.nodeCoords,
				bezierData: element.bezierData
			}
		})
	)
}

module.exports = seedMaps;