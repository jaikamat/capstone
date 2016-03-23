'use strict';
var mongoose = require('mongoose');

var schema = new mongoose.Schema({
	scrollId: {type: Number, min: 1, unique: true, required: true},

	data: [{
		itemType: {type: String, enum: ['i', 'c'], required: true},
		conn: {
			next: {type: Number, min: -1},
			truePath: {type: Number, min: -1},
			falsePath: {type: Number, min: -1}
		}
	}]
});

mongoose.model('Scroll', schema);

// might need additional pre-validation hooks
