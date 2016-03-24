'use strict';
var mongoose = require('mongoose');
var Promise = require('bluebird');
var Scrolls = Promise.promisifyAll(mongoose.model('Scrolls'));
var scrollData = require('../rawData/scrolls.json');

function seedScrolls () {
	return Scrolls.createAsync(
		scrollData.map(function (element, index) {
			return {
				scrollId: index + 1,
				data: element
			}
		})
	)
}

module.exports = seedScrolls;