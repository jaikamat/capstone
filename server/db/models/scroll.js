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
	}],
	scrollCoords: mongoose.Schema.Types.Mixed,
	bezierData: [{
		start: {type: Number},
		end: {type: Number},
		color: {type: String, enum: ['red', 'green']},
		curvature: {type: Number}
	}]
});

mongoose.model('Scrolls', schema);