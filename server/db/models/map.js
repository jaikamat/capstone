'use strict';
var mongoose = require('mongoose');

var schema = new mongoose.Schema({
	mapId: {type: Number, min: 1, unique: true},
	data: [{
		red: {type: Number, min: 0},
		blue: {type: Number, min: 0},
		green: {type: Number, min: 0},
		troll: {type: String, enum: ['orange', 'purple', null]}
	}]
});

mongoose.model('Maps', schema);