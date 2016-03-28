'use strict';
var mongoose = require('mongoose');
var Promise = require('bluebird');
var Params = Promise.promisifyAll(mongoose.model('Params'));
var paramData = require('../rawData/params.json');

function seedParams () {
	return Params.createAsync(
		paramData.map(function (element, index) {
			return {
				paramId: index + 1,
				data: element
			}
		})
	)
}

module.exports = seedParams;