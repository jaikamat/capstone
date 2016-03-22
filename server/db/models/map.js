'use strict';
var mongoose = require('mongoose');

var schema = new mongoose.Schema({
	mapId: {type: Number, min: 0},
	data: [{
		red: {type: String, min: 0},
		blue: {type: String, min: 0},
		green: {type: String, min: 0},
		troll: {type: String, enum: ['orange', 'purple']}
	}]
});

mongoose.model('Map', schema);
