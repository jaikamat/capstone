'use strict';
var mongoose = require('mongoose');
var Promise = require('bluebird');
var Params = Promise.promisifyAll(mongoose.model('Params'));
var paramData = require('../rawData/params.json');

function seedParams () {
	return Params.createAsync(
		paramData.map(function (element, index) {
			element.paramId = index + 1;
			return element;
		})
	)
}

module.exports = seedParams;