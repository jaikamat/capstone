'use strict';
var mongoose = require('mongoose');

var schema = new mongoose.Schema({
	scrollId: {type: Number, min: 0},

	data: [{
		itemType: {type: String, enum: ['i', 'c'],
		conn: {
			next: ,
			truePath ,
			falsePath ,
		}
	}]
})
