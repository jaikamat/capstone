'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new mongoose.Schema({
  	level: {type: Number, min: 1, required: true, unique: true},
	map: {type: Schema.Types.ObjectId, ref: 'Map', required: true},
	scroll: {type: Schema.Types.ObjectId, ref: 'Scroll', required: true},
	params: {type: Schema.Types.ObjectId, ref: 'Params', required: true}
});

mongoose.model('Level', schema);
