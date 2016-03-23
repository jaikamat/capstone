'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new mongoose.Schema({
  	levelId: {type: Number, min: 1, required: true, unique: true},
	map: {type: Schema.Types.ObjectId, ref: 'Maps', required: true},
	scroll: {type: Schema.Types.ObjectId, ref: 'Scrolls', required: true},
	params: {type: Schema.Types.ObjectId, ref: 'Params', required: true}
});

mongoose.model('Levels', schema);
