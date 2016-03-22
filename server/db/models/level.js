'use strict';
var mongoose = require('mongoose');

var schema = new mongoose.Schema({
	map: {type: Schema.Types.ObjectId, ref: 'Map'},
	scroll: {type: Schema.Types.ObjectId, ref: 'Scroll'},
	params: {type: Schema.Types.ObjectId, ref: 'Params'}
});

mongoose.model('Level', schema);
